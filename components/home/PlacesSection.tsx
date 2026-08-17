import Image from 'next/image';
import Link from 'next/link';
import { NormalizedPlacesProps } from '@/types/cms';

export function PlacesSection({ eyebrow, title, text, imgUrl }: NormalizedPlacesProps) {
  return (
    <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
      {imgUrl ? (
        <Image
          src={imgUrl}
          fill
          sizes="100vw"
          className="object-cover"
          alt="Palacio San José u otro lugar histórico"
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

      <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
        {eyebrow ? (
          <p className="eyebrow text-[11px] uppercase text-white/80 mb-6 reveal">
            {eyebrow}
          </p>
        ) : null}

        {title ? (
          <h2 className="font-serif font-light text-white text-4xl md:text-6xl uppercase max-w-2xl leading-tight reveal whitespace-pre-line">
            {title}
          </h2>
        ) : null}

        {text ? (
          <p className="mt-7 max-w-xl text-white/85 font-light text-lg leading-relaxed reveal">
            {text}
          </p>
        ) : null}

        <div className="mt-9 reveal">
          <Link
            href="/lugares"
            id="home-places-discover-btn"
            className="btn-ghost inline-flex items-center gap-3 border border-white/70 text-white text-[11px] uppercase tracking-wide-nav px-9 py-4"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Descubra más
          </Link>
        </div>
      </div>
    </section>
  );
}
