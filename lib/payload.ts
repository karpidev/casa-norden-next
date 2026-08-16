/**
 * Cliente de integración para consumir la API REST de Payload CMS 3.0.
 * Optimizado para generación estática (SSG) en Next.js y Cloudflare Pages.
 */

const PAYLOAD_URL =
  process.env.PAYLOAD_URL ||
  process.env.NEXT_PUBLIC_PAYLOAD_URL ||
  'http://localhost:3001';

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
 * Ejecuta una petición HTTP contra los endpoints REST de Payload CMS.
 */
async function fetchPayload<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${PAYLOAD_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    // En tiempo de build para SSG Next.js consume los datos estáticamente
    next: { revalidate: 60, ...options.next },
  });

  if (!res.ok) {
    throw new Error(`[Payload API] Error al obtener datos de ${url}: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Obtiene los datos del Global 'home'.
 */
export async function getHomeGlobal() {
  return fetchPayload<any>('/api/globals/home?depth=2');
}

/**
 * Obtiene los datos del Global 'historia'.
 */
export async function getHistoriaGlobal() {
  return fetchPayload<any>('/api/globals/historia?depth=1');
}

/**
 * Obtiene la lista de hitos históricos ordenados.
 */
export async function getFechas() {
  const res = await fetchPayload<{ docs: any[] }>('/api/fechas?limit=100&sort=order');
  return res.docs || [];
}

/**
 * Obtiene la lista de lugares con historia.
 */
export async function getLugares() {
  const res = await fetchPayload<{ docs: any[] }>('/api/lugares?limit=100&depth=1');
  return res.docs || [];
}

/**
 * Obtiene la lista de leyendas.
 */
export async function getLeyendas() {
  const res = await fetchPayload<{ docs: any[] }>('/api/leyendas?limit=100&depth=1');
  return res.docs || [];
}

/**
 * Obtiene la lista de memorias (personajes).
 */
export async function getMemorias() {
  const res = await fetchPayload<{ docs: any[] }>('/api/memorias?limit=100&depth=1');
  return res.docs || [];
}
