/**
 * Cliente de integración para consumir la API REST de Payload CMS 3.0.
 * Optimizado para generación estática (SSG) en Next.js y Cloudflare Pages.
 */

const getPayloadUrl = () => {
  const rawUrl = process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL;
  if (rawUrl && rawUrl.trim() !== '') {
    return rawUrl.trim().replace(/\/$/, '');
  }
  // En producción (CI/CD o Cloudflare) apuntar directamente al backend en producción
  return process.env.NODE_ENV === 'production'
    ? 'https://admin.casanorden.com.ar'
    : 'http://localhost:3001';
};

const PAYLOAD_URL = getPayloadUrl();

export interface MediaDoc {
  id?: number | string;
  url?: string;
  filename?: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * Resuelve la URL pública de una imagen proveniente de Payload CMS o ruta local.
 */
export function getMediaUrl(media?: MediaDoc | string | null, fallback = ''): string {
  if (!media) return fallback;
  if (typeof media === 'string') {
    if (media.startsWith('http://') || media.startsWith('https://') || media.startsWith('/')) {
      return media;
    }
    return `${PAYLOAD_URL}${media.startsWith('/') ? '' : '/'}${media}`;
  }
  if (media.url) {
    if (media.url.startsWith('http://') || media.url.startsWith('https://')) {
      return media.url;
    }
    return `${PAYLOAD_URL}${media.url.startsWith('/') ? '' : '/'}${media.url}`;
  }
  return fallback;
}

/**
 * Ejecuta una petición HTTP con reintentos para soportar cold starts del backend (Render).
 */
async function fetchPayload<T>(endpoint: string, options: RequestInit = {}, retries = 3): Promise<T> {
  const url = `${PAYLOAD_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        next: { revalidate: 60, ...options.next },
      });

      if (!res.ok) {
        throw new Error(`[Payload API] Error ${res.status} ${res.statusText} en ${url}`);
      }

      return await res.json();
    } catch (error) {
      if (attempt === retries) {
        console.error(`[Payload API] Falló la petición a ${url} tras ${retries} intentos:`, error);
        throw error;
      }
      // Esperar 4 segundos antes de reintentar (útil si Render está despertando)
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }
  }

  throw new Error(`[Payload API] No se pudo conectar a ${url}`);
}

/**
 * Obtiene los datos del Global 'home'.
 */
export async function getHomeGlobal() {
  try {
    return await fetchPayload<any>('/api/globals/home?depth=2');
  } catch (error) {
    console.error('Error al cargar Global Home:', error);
    return null;
  }
}

/**
 * Obtiene los datos del Global 'historia'.
 */
export async function getHistoriaGlobal() {
  try {
    return await fetchPayload<any>('/api/globals/historia?depth=1');
  } catch (error) {
    console.error('Error al cargar Global Historia:', error);
    return null;
  }
}

/**
 * Obtiene la lista de hitos históricos ordenados.
 */
export async function getFechas() {
  try {
    const res = await fetchPayload<{ docs: any[] }>('/api/fechas?limit=100&sort=order');
    return res.docs || [];
  } catch (error) {
    console.error('Error al cargar Fechas:', error);
    return [];
  }
}

/**
 * Obtiene la lista de lugares con historia.
 */
export async function getLugares() {
  try {
    const res = await fetchPayload<{ docs: any[] }>('/api/lugares?limit=100&depth=1');
    return res.docs || [];
  } catch (error) {
    console.error('Error al cargar Lugares:', error);
    return [];
  }
}

/**
 * Obtiene la lista de leyendas.
 */
export async function getLeyendas() {
  try {
    const res = await fetchPayload<{ docs: any[] }>('/api/leyendas?limit=100&depth=1');
    return res.docs || [];
  } catch (error) {
    console.error('Error al cargar Leyendas:', error);
    return [];
  }
}

/**
 * Obtiene la lista de memorias (personajes).
 */
export async function getMemorias() {
  try {
    const res = await fetchPayload<{ docs: any[] }>('/api/memorias?limit=100&depth=1');
    return res.docs || [];
  } catch (error) {
    console.error('Error al cargar Memorias:', error);
    return [];
  }
}
