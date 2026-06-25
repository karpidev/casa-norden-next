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

// Decodifica una cadena en formato Base64URL a texto plano UTF-8
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

// Convierte una cadena en formato Base64URL a un ArrayBuffer de bytes
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

// Obtiene el valor de una cookie específica a partir de la cabecera Cookie
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

// Valida el token JWT de Cloudflare Access
async function verifyToken(token: string, teamDomain: string, expectedAud: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.error('[Cloudflare Access] El token no tiene 3 partes.');
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
    console.error('[Cloudflare Access] Error al decodificar cabecera o payload del token:', err);
    return false;
  }

  // 2. Validar que el algoritmo sea RS256
  if (header.alg !== 'RS256') {
    console.error(`[Cloudflare Access] Algoritmo no soportado: ${header.alg}. Se esperaba RS256.`);
    return false;
  }

  // 3. Validar tiempos de expiración y activación
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    console.error(`[Cloudflare Access] Token expirado. exp: ${payload.exp}, now: ${now}, diff: ${now - payload.exp}s tarde.`);
    return false;
  }
  if (payload.nbf && payload.nbf > now) {
    console.error(`[Cloudflare Access] Token no activo aún. nbf: ${payload.nbf}, now: ${now}.`);
    return false;
  }

  // 4. Validar emisor (iss) y audiencia (aud)
  const normalizedTeamDomain = teamDomain.startsWith('http') ? teamDomain : `https://${teamDomain}`;
  const cleanIss = (payload.iss || '').trim().replace(/\/$/, '');
  const cleanDomain = normalizedTeamDomain.trim().replace(/\/$/, '');
  
  if (cleanIss !== cleanDomain) {
    console.error(`[Cloudflare Access] Emisor (iss) inválido. Recibido: "${cleanIss}", Esperado: "${cleanDomain}"`);
    return false;
  }

  const audienceList = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  const cleanExpectedAud = expectedAud.trim().replace(/[^a-fA-F0-9]/g, '');

  const hasValidAudience = audienceList.some((audItem: any) => {
    if (typeof audItem !== 'string') return false;
    return audItem.trim().replace(/[^a-fA-F0-9]/g, '') === cleanExpectedAud;
  });

  if (!hasValidAudience) {
    console.error(`[Cloudflare Access] Audiencia (aud) inválida.
Recibido original: ${JSON.stringify(payload.aud)}
Esperado original: "${expectedAud}" (limpio: "${cleanExpectedAud}")`);
    return false;
  }

  // 5. Validar la firma criptográfica RS256 usando Web Crypto API
  const certsUrl = `${normalizedTeamDomain}/cdn-cgi/access/certs`;
  const response = await fetch(certsUrl);
  if (!response.ok) {
    throw new Error(`No se pudieron obtener los certificados públicos de Cloudflare desde ${certsUrl}`);
  }
  const jwks: JWKS = await response.json();

  // Buscar la clave pública con el kid correspondiente
  const jwk = jwks.keys.find((key) => key.kid === header.kid);
  if (!jwk) {
    console.error(`[Cloudflare Access] No se encontró clave pública para el kid: ${header.kid}`);
    return false;
  }

  // Importar la clave JWK en el formato Web Crypto
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

  // Verificar los datos firmados
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
    console.error('[Cloudflare Access] La firma criptográfica del token no es válida.');
  }

  return isSignatureValid;
}

// Middleware de Cloudflare Pages que se ejecuta para cualquier ruta en /admin/*
export async function onRequest(context: {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}): Promise<Response> {
  const { request, env } = context;
  const teamDomain = env.CLOUDFLARE_TEAM_DOMAIN?.trim();
  const aud = env.CLOUDFLARE_APPLICATION_AUD?.trim();

  // Si no se encuentran configuradas las variables de entorno en el panel de Cloudflare,
  // asumimos que estamos en desarrollo local y permitimos el acceso mostrando un warning en la consola.
  if (!teamDomain || !aud) {
    console.warn(
      '[Cloudflare Access Middleware] ADVERTENCIA: CLOUDFLARE_TEAM_DOMAIN o CLOUDFLARE_APPLICATION_AUD no están configuradas. Omitiendo validación del token de sesión para desarrollo local.'
    );
    return context.next();
  }

  // Intentar obtener el token de la cookie o de la cabecera
  const cookieHeader = request.headers.get('Cookie') || '';
  let token = getCookie(cookieHeader, 'CF_Authorization');

  if (!token) {
    token = request.headers.get('Cf-Access-Jwt-Assertion') || '';
  }

  if (!token) {
    return new Response('Acceso Denegado: No se encontró el token de Cloudflare Access.', {
      status: 401,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  try {
    const isValid = await verifyToken(token, teamDomain, aud);
    if (!isValid) {
      return new Response('Acceso Denegado: Token de Cloudflare Access inválido o expirado.', {
        status: 401,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  } catch (error) {
    console.error('Error al validar el token de Cloudflare Access:', error);
    return new Response('Acceso Denegado: Ocurrió un error al verificar la firma de seguridad.', {
      status: 401,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return context.next();
}
