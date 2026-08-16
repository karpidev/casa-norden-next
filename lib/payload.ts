/**
 * Cliente de integración para consumir la API REST de Payload CMS 3.0.
 * Incorpora soporte para ISR On-Demand con Cache Tags semánticos.
 */

const getPayloadUrl = (): string => {
  const rawUrl = process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL;
  if (rawUrl && rawUrl.trim() !== '') {
    return rawUrl.trim().replace(/\/$/, '');
  }
  // En producción apuntar al backend desplegado
  return process.env.NODE_ENV === 'production'
    ? 'https://admin.casanorden.com.ar'
    : 'http://localhost:3001';
};

const PAYLOAD_URL = getPayloadUrl();

// 0 segundos en desarrollo (sin caché), 30 días en producción (delegado a invalidación On-Demand por webhooks)
const REVALIDATE_TIME =
  process.env.NODE_ENV === 'development' ? 0 : 30 * 24 * 60 * 60;

export interface MediaDoc {
  id?: number | string;
  url?: string;
  filename?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface FetchPayloadOptions extends RequestInit {
  tags?: string[];
  revalidate?: number | false;
}

/**
 * Resuelve la URL pública de una imagen proveniente de Payload CMS, Cloudflare R2 o ruta local.
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
 * Ejecuta una petición HTTP a Payload CMS con caché controlada por Tags y reintentos automáticos.
 */
async function fetchPayload<T>(
  endpoint: string,
  options: FetchPayloadOptions = {},
  retries = 3
): Promise<T> {
  const url = `${PAYLOAD_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const revalidate =
    options.revalidate !== undefined ? options.revalidate : REVALIDATE_TIME;
  const tags = options.tags || [];

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'User-Agent': 'Mozilla/5.0 CasaNorden-Frontend/1.0',
          ...(options.headers || {}),
        },
        next: {
          revalidate,
          tags,
          ...options.next,
        },
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
      // Esperar 2 segundos antes de reintentar (por si el backend está reactivándose)
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  throw new Error(`[Payload API] No se pudo conectar a ${url}`);
}

/**
 * Obtiene los datos del Global 'home'.
 */
export async function getHomeGlobal() {
  try {
    return await fetchPayload<any>('/api/globals/home?depth=2', {
      tags: ['global_home', 'home'],
    });
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
    return await fetchPayload<any>('/api/globals/historia?depth=1', {
      tags: ['global_historia', 'historia'],
    });
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
    const res = await fetchPayload<{ docs: any[] }>(
      '/api/fechas?limit=100&sort=order',
      { tags: ['collection_fechas', 'fechas'] }
    );
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
    const res = await fetchPayload<{ docs: any[] }>(
      '/api/lugares?limit=100&depth=1',
      { tags: ['collection_lugares', 'lugares'] }
    );
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
    const res = await fetchPayload<{ docs: any[] }>(
      '/api/leyendas?limit=100&depth=1',
      { tags: ['collection_leyendas', 'leyendas'] }
    );
    return res.docs || [];
  } catch (error) {
    console.error('Error al cargar Leyendas:', error);
    return [];
  }
}

/**
 * Obtiene la lista de memorias (personajes históricos).
 */
export async function getMemorias() {
  try {
    const res = await fetchPayload<{ docs: any[] }>(
      '/api/memorias?limit=100&depth=1',
      { tags: ['collection_memorias', 'memorias'] }
    );
    return res.docs || [];
  } catch (error) {
    console.error('Error al cargar Memorias:', error);
    return [];
  }
}
