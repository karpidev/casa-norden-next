import Image from 'next/image';
import { NormalizedAboutProps } from '@/types/cms';

export function AboutSection({ eyebrow, title, text, imgUrl }: NormalizedAboutProps) {
  return (
    <section className="relative bg-ink text-stone py-28 lg:py-40 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {eyebrow ? (
          <p className="eyebrow text-[11px] uppercase text-stone/60 mb-8 reveal">
            {eyebrow}
          </p>
        ) : null}

        {title ? (
          <h2 className="font-serif font-light text-4xl md:text-6xl uppercase max-w-3xl leading-tight reveal whitespace-pre-line">
            {title}
          </h2>
        ) : null}

        {text ? (
          <p className="mt-8 max-w-2xl text-stone/70 font-light text-lg leading-relaxed reveal">
            {text}
          </p>
        ) : null}

        {imgUrl ? (
          <div className="relative mt-16 h-[420px] md:h-[560px] reveal">
            <Image
              src={imgUrl}
              fill
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover"
              alt="Detalle en primer plano del Memorial"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
