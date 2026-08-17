/**
 * Cliente de integración para consumir la API REST de Payload CMS 3.x.
 * Incorpora soporte para ISR On-Demand con Cache Tags semánticos y tipado estricto.
 */

import {
  CMSMedia,
  FechaItem,
  HistoriaGlobal,
  HomeGlobal,
  LeyendaItem,
  LugaresItem,
  MemoryItem,
  NormalizedFeaturedCard,
  NormalizedHomeData,
  NormalizedMemoryCircle,
} from '@/types/cms';

export function getPayloadUrl(): string {
  const rawUrl = process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL;
  if (rawUrl && rawUrl.trim() !== '') {
    return rawUrl.trim().replace(/\/$/, '');
  }
  // En producción apuntar siempre al backend desplegado
  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://admin.casanorden.com.ar';
}

// 0 segundos en desarrollo (sin caché), 30 días en producción (delegado a invalidación On-Demand por webhooks)
const REVALIDATE_TIME =
  process.env.NODE_ENV === 'development' ? 0 : 30 * 24 * 60 * 60;

export interface FetchPayloadOptions extends RequestInit {
  tags?: string[];
  revalidate?: number | false;
}

interface PayloadCollectionResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

/**
 * Resuelve la URL pública de una imagen proveniente de Payload CMS, Cloudflare R2 o ruta local.
 */
export function getMediaUrl(media?: CMSMedia | string | null, fallback = ''): string {
  if (!media) return fallback;
  const payloadUrl = getPayloadUrl();
  if (typeof media === 'string') {
    if (media.startsWith('http://') || media.startsWith('https://') || media.startsWith('/')) {
      return media;
    }
    return `${payloadUrl}${media.startsWith('/') ? '' : '/'}${media}`;
  }
  if (media.url) {
    if (media.url.startsWith('http://') || media.url.startsWith('https://')) {
      return media.url;
    }
    return `${payloadUrl}${media.url.startsWith('/') ? '' : '/'}${media.url}`;
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
  const payloadUrl = getPayloadUrl();
  const url = `${payloadUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
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
export async function getHomeGlobal(): Promise<HomeGlobal | null> {
  try {
    return await fetchPayload<HomeGlobal>('/api/globals/home?depth=2', {
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
export async function getHistoriaGlobal(): Promise<HistoriaGlobal | null> {
  try {
    return await fetchPayload<HistoriaGlobal>('/api/globals/historia?depth=1', {
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
export async function getFechas(): Promise<FechaItem[]> {
  try {
    const res = await fetchPayload<PayloadCollectionResponse<FechaItem>>(
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
export async function getLugares(): Promise<LugaresItem[]> {
  try {
    const res = await fetchPayload<PayloadCollectionResponse<LugaresItem>>(
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
export async function getLeyendas(): Promise<LeyendaItem[]> {
  try {
    const res = await fetchPayload<PayloadCollectionResponse<LeyendaItem>>(
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
export async function getMemorias(): Promise<MemoryItem[]> {
  try {
    const res = await fetchPayload<PayloadCollectionResponse<MemoryItem>>(
      '/api/memorias?limit=100&depth=1',
      { tags: ['collection_memorias', 'memorias'] }
    );
    return res.docs || [];
  } catch (error) {
    console.error('Error al cargar Memorias:', error);
    return [];
  }
}

/**
 * Normaliza los datos del Global Home para consumo desacoplado en componentes UI.
 * Mueve la lógica de transformación fuera de la capa de renderizado (Single Responsibility).
 */
export function normalizeHomeData(data: HomeGlobal | null): NormalizedHomeData {
  const hero = data?.hero || {};
  const featuredSection = data?.featuredMemoriesSection || {};
  const about = data?.about || {};
  const places = data?.places || {};
  const moreFeaturedSection = data?.moreFeaturedSection || {};
  const cta = data?.cta || {};

  // Normalización del modo híbrido de memorias destacadas
  const memoriesList: NormalizedMemoryCircle[] = [];

  if (featuredSection.mode === 'collection' && Array.isArray(featuredSection.selectedMemories)) {
    featuredSection.selectedMemories.forEach((mem, index) => {
      if (!mem || typeof mem === 'number') return;
      memoriesList.push({
        name: mem.name || '',
        imgUrl: getMediaUrl(mem.img, '/images/urquiza.jpg'),
        link: '/memorias',
        seed: mem.slug || `memory-col-${index}`,
      });
    });
  } else if (Array.isArray(featuredSection.customMemories)) {
    featuredSection.customMemories.forEach((mem, index) => {
      if (!mem) return;
      memoriesList.push({
        name: mem.name || '',
        imgUrl: getMediaUrl(mem.img, '/images/urquiza.jpg'),
        link: mem.link || '/memorias',
        seed: mem.name ? mem.name.toLowerCase().replace(/[^a-z0-9]/g, '') : `memory-custom-${index}`,
      });
    });
  }

  // Normalización de las cards de Más Destacado
  const cardsList: NormalizedFeaturedCard[] = [];
  if (Array.isArray(moreFeaturedSection.cards)) {
    moreFeaturedSection.cards.forEach((c, index) => {
      if (!c) return;
      const seed = c.title ? c.title.toLowerCase().replace(/[^a-z0-9]/g, '') : `featured-${index}`;
      cardsList.push({
        seed,
        title: c.title || '',
        tag: c.tag || '',
        href: c.href || '/',
        imgUrl: getMediaUrl(c.img, '/images/ramirez.jpg'),
      });
    });
  }

  return {
    hero: {
      eyebrow: hero.eyebrow,
      title: hero.title,
      text: hero.text,
      imgUrl: getMediaUrl(hero.img, '/images/casanorden-rio.jpg'),
    },
    featuredMemories: {
      title: featuredSection.title,
      memories: memoriesList,
    },
    about: {
      eyebrow: about.eyebrow,
      title: about.title,
      text: about.text,
      imgUrl: getMediaUrl(about.img, '/images/casanorden-earth.jpg'),
    },
    places: {
      eyebrow: places.eyebrow,
      title: places.title,
      text: places.text,
      imgUrl: getMediaUrl(places.img, '/images/palacio-sanjose.jpg'),
    },
    moreFeatured: {
      title: moreFeaturedSection.title,
      cards: cardsList,
    },
    cta: {
      eyebrow: cta.eyebrow,
      title: cta.title,
      imgUrl: getMediaUrl(cta.img, '/images/cdu-ciudad.jpg'),
    },
  };
}
