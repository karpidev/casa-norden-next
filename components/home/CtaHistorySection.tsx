import Image from 'next/image';
import Link from 'next/link';
import { NormalizedCtaHistoryProps } from '@/types/cms';

export function CtaHistorySection({ eyebrow, title, imgUrl }: NormalizedCtaHistoryProps) {
  return (
    <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
      {imgUrl ? (
        <Image
          src={imgUrl}
          fill
          sizes="100vw"
          className="object-cover"
          alt="Calle colonial de Concepción del Uruguay"
        />
      ) : null}

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center items-start">
        {eyebrow ? (
          <p className="eyebrow text-[11px] uppercase text-white/80 mb-5 reveal">
            {eyebrow}
          </p>
        ) : null}

        {title ? (
          <h2 className="font-serif font-light text-white text-4xl md:text-6xl uppercase max-w-3xl leading-tight reveal whitespace-pre-line">
            {title}
          </h2>
        ) : null}

        <Link
          href="/historia"
          id="home-about-us-btn"
          className="mt-9 btn-ghost inline-block border border-white/70 text-white text-[11px] uppercase tracking-wide-nav px-9 py-4 reveal"
        >
          Conózcanos
        </Link>
      </div>
    </section>
  );
}
