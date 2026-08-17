/**
 * Contratos TypeScript estrictos para la integración con Payload CMS 3.x
 * y la presentación en componentes de Next.js (arquitectura SOLID y RSC).
 */

// ==========================================
// 1. Contratos de Medios (Cloudflare R2 / Payload Media)
// ==========================================

export interface CMSMedia {
  id?: number | string;
  url?: string | null;
  filename?: string;
  alt?: string | null;
  width?: number;
  height?: number;
}

// ==========================================
// 2. Entidades de Colecciones (Backend Docs)
// ==========================================

export interface FechaItem {
  id: number;
  year: string;
  title: string;
  text: string;
  order?: number | null;
  slug?: string | null;
  updatedAt?: string;
  createdAt?: string;
}

export interface LugaresItem {
  id: number;
  title: string;
  slug?: string | null;
  tag?: string | null;
  img?: CMSMedia | string | null;
  text?: string | null;
  updatedAt?: string;
  createdAt?: string;
}

export interface LeyendaItem {
  id: number;
  title: string;
  slug?: string | null;
  tag?: string | null;
  img?: CMSMedia | string | null;
  text?: string | null;
  updatedAt?: string;
  createdAt?: string;
}

export interface MemoryItem {
  id: number;
  name: string;
  slug?: string | null;
  years?: string | null;
  img?: CMSMedia | string | null;
  text?: string | null;
  updatedAt?: string;
  createdAt?: string;
}

// ==========================================
// 3. Documentos de Globals (Home & Historia)
// ==========================================

export interface HomeGlobal {
  id?: number;
  hero?: {
    eyebrow?: string | null;
    title?: string | null;
    text?: string | null;
    img?: CMSMedia | string | null;
  };
  featuredMemoriesSection?: {
    title?: string | null;
    mode?: 'collection' | 'custom';
    selectedMemories?: (MemoryItem | number | null)[];
    customMemories?: {
      name?: string | null;
      img?: CMSMedia | string | null;
      link?: string | null;
      id?: string | null;
    }[];
  };
  about?: {
    eyebrow?: string | null;
    title?: string | null;
    text?: string | null;
    img?: CMSMedia | string | null;
  };
  places?: {
    eyebrow?: string | null;
    title?: string | null;
    text?: string | null;
    img?: CMSMedia | string | null;
  };
  moreFeaturedSection?: {
    title?: string | null;
    cards?: {
      tag?: string | null;
      title?: string | null;
      href?: string | null;
      img?: CMSMedia | string | null;
      id?: string | null;
    }[];
  };
  cta?: {
    eyebrow?: string | null;
    title?: string | null;
    img?: CMSMedia | string | null;
  };
  updatedAt?: string;
  createdAt?: string;
}

export interface HistoriaGlobal {
  id?: number;
  hero?: {
    title: string;
    text?: string | null;
    img?: CMSMedia | string | null;
  };
  mission?: {
    title?: string | null;
    text?: string | null;
  };
  vision?: {
    subTitle?: string | null;
    subText?: string | null;
    subImg?: CMSMedia | string | null;
  };
  values?:
    | {
        n?: string | null;
        title: string;
        text?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedAt?: string;
  createdAt?: string;
}

// ==========================================
// 4. Interfaces Normalizadas para Componentes (Props)
// ==========================================

export interface NormalizedHeroProps {
  eyebrow?: string | null;
  title?: string | null;
  text?: string | null;
  imgUrl: string;
}

export interface NormalizedMemoryCircle {
  name: string;
  imgUrl: string;
  link: string;
  seed: string;
}

export interface NormalizedFeaturedMemoriesProps {
  title?: string | null;
  memories: NormalizedMemoryCircle[];
}

export interface NormalizedAboutProps {
  eyebrow?: string | null;
  title?: string | null;
  text?: string | null;
  imgUrl: string;
}

export interface NormalizedPlacesProps {
  eyebrow?: string | null;
  title?: string | null;
  text?: string | null;
  imgUrl: string;
}

export interface NormalizedFeaturedCard {
  seed: string;
  title: string;
  tag: string;
  href: string;
  imgUrl: string;
}

export interface NormalizedMoreFeaturedProps {
  title?: string | null;
  cards: NormalizedFeaturedCard[];
}

export interface NormalizedCtaHistoryProps {
  eyebrow?: string | null;
  title?: string | null;
  imgUrl: string;
}

export interface NormalizedHomeData {
  hero: NormalizedHeroProps;
  featuredMemories: NormalizedFeaturedMemoriesProps;
  about: NormalizedAboutProps;
  places: NormalizedPlacesProps;
  moreFeatured: NormalizedMoreFeaturedProps;
  cta: NormalizedCtaHistoryProps;
}
