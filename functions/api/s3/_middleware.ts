interface Env {
  CLOUDFLARE_TEAM_DOMAIN?: string;
  CLOUDFLARE_APPLICATION_AUD?: string;
}

interface JWK {
  kid: string;
  kty: string;
  alg: string;
  use: string;
  n: string;
  e: string;
  [key: string]: any;
}

interface JWKS {
  keys: JWK[];
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

function base64UrlToArrayBuffer(str: string): ArrayBuffer {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function getCookie(cookieHeader: string, name: string): string | null {
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const [key, value] = pair.split('=').map((c) => c.trim());
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

async function verifyToken(token: string, teamDomain: string, expectedAud: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.error('[Cloudflare Access S3] El token no tiene 3 partes.');
    return false;
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  // 1. Decodificar cabecera y payload
  let header: any;
  let payload: any;
  try {
    header = JSON.parse(base64UrlDecode(headerB64));
    payload = JSON.parse(base64UrlDecode(payloadB64));
  } catch (err) {
    console.error('[Cloudflare Access S3] Error al decodificar cabecera o payload del token:', err);
    return false;
  }

  // 2. Validar que el algoritmo sea RS256
  if (header.alg !== 'RS256') {
    console.error(`[Cloudflare Access S3] Algoritmo no soportado: ${header.alg}. Se esperaba RS256.`);
    return false;
  }

  // 3. Validar tiempos de expiración y activación
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    console.error(`[Cloudflare Access S3] Token expirado. exp: ${payload.exp}, now: ${now}.`);
    return false;
  }
  if (payload.nbf && payload.nbf > now) {
    console.error(`[Cloudflare Access S3] Token no activo aún. nbf: ${payload.nbf}, now: ${now}.`);
    return false;
  }

  // 4. Validar emisor (iss) y audiencia (aud)
  const normalizedTeamDomain = teamDomain.startsWith('http') ? teamDomain : `https://${teamDomain}`;
  const cleanIss = (payload.iss || '').trim().replace(/\/$/, '');
  const cleanDomain = normalizedTeamDomain.trim().replace(/\/$/, '');
  
  if (cleanIss !== cleanDomain) {
    console.error(`[Cloudflare Access S3] Emisor (iss) inválido. Recibido: "${cleanIss}", Esperado: "${cleanDomain}"`);
    return false;
  }

  const audienceList = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  const cleanExpectedAud = expectedAud.trim().replace(/[^a-fA-F0-9]/g, '');

  const hasValidAudience = audienceList.some((audItem: any) => {
    if (typeof audItem !== 'string') return false;
    return audItem.trim().replace(/[^a-fA-F0-9]/g, '') === cleanExpectedAud;
  });

  if (!hasValidAudience) {
    console.error(`[Cloudflare Access S3] Audiencia (aud) inválida. Recibido: ${JSON.stringify(payload.aud)}, Esperado: "${cleanExpectedAud}"`);
    return false;
  }

  // 5. Validar la firma criptográfica RS256 usando Web Crypto API
  const certsUrl = `${normalizedTeamDomain}/cdn-cgi/access/certs`;
  const response = await fetch(certsUrl);
  if (!response.ok) {
    throw new Error(`No se pudieron obtener los certificados públicos de Cloudflare desde ${certsUrl}`);
  }
  const jwks: JWKS = await response.json();

  const jwk = jwks.keys.find((key) => key.kid === header.kid);
  if (!jwk) {
    console.error(`[Cloudflare Access S3] No se encontró clave pública para el kid: ${header.kid}`);
    return false;
  }

  const publicKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['verify']
  );

  const encoder = new TextEncoder();
  const dataToVerify = encoder.encode(`${headerB64}.${payloadB64}`);
  const signatureBytes = base64UrlToArrayBuffer(signatureB64);

  const isSignatureValid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    signatureBytes,
    dataToVerify
  );

  if (!isSignatureValid) {
    console.error('[Cloudflare Access S3] La firma criptográfica del token no es válida.');
  }

  return isSignatureValid;
}

export async function onRequest(context: {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}): Promise<Response> {
  const { request, env } = context;
  const teamDomain = env.CLOUDFLARE_TEAM_DOMAIN?.trim();
  const aud = env.CLOUDFLARE_APPLICATION_AUD?.trim();

  // Omitir validación en desarrollo local
  if (!teamDomain || !aud) {
    return context.next();
  }

  // Intentar obtener el token
  const cookieHeader = request.headers.get('Cookie') || '';
  let token = getCookie(cookieHeader, 'CF_Authorization');

  if (!token) {
    token = request.headers.get('Cf-Access-Jwt-Assertion') || '';
  }

  if (!token) {
    return new Response('Acceso Denegado: No se encontró el token de Cloudflare Access en API S3.', {
      status: 401,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  try {
    const isValid = await verifyToken(token, teamDomain, aud);
    if (!isValid) {
      return new Response('Acceso Denegado: Token de Cloudflare Access inválido en API S3.', {
        status: 401,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  } catch (error) {
    console.error('Error al validar el token en API S3:', error);
    return new Response('Acceso Denegado: Error al verificar la firma en API S3.', {
      status: 401,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return context.next();
}
