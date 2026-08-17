import Image from 'next/image';
import Link from 'next/link';
import { NormalizedHeroProps } from '@/types/cms';

export function HeroSection({ eyebrow, title, text, imgUrl }: NormalizedHeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {imgUrl ? (
        <Image
          src={imgUrl}
          alt={text || 'Vista de Casa Norden'}
          fill
          priority
          sizes="100vw"
          className="hero-img object-cover"
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />

      <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
        {eyebrow ? (
          <p className="eyebrow text-[11px] md:text-xs uppercase text-white/80 mb-6 reveal">
            {eyebrow}
          </p>
        ) : null}

        {title ? (
          <h1 className="hero-title font-serif font-light text-white text-5xl md:text-7xl lg:text-8xl uppercase max-w-4xl reveal whitespace-pre-line">
            {title}
          </h1>
        ) : null}

        {text ? (
          <p className="mt-8 max-w-md text-white/85 font-light text-base md:text-lg leading-relaxed reveal">
            {text}
          </p>
        ) : null}

        <div className="mt-10 reveal">
          <Link
            href="/memorias"
            id="home-hero-discover-btn"
            className="btn-ghost inline-block border border-white/70 text-white text-[11px] uppercase tracking-wide-nav px-9 py-4"
          >
            Descubra más
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 animate-bounce">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
        >
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
