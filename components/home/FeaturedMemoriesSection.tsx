import Image from 'next/image';
import Link from 'next/link';
import { NormalizedFeaturedMemoriesProps } from '@/types/cms';

export function FeaturedMemoriesSection({ title, memories }: NormalizedFeaturedMemoriesProps) {
  if (!memories || memories.length === 0) return null;

  const titleWords = title ? title.split(' ') : [];
  const mainTitle = titleWords.slice(0, -1).join(' ');
  const highlightWord = titleWords[titleWords.length - 1];

  return (
    <section className="bg-stone py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {title ? (
          <h2 className="text-center text-[12px] md:text-sm uppercase tracking-mega text-ink/80 mb-16 reveal">
            {mainTitle} <span className="font-medium">{highlightWord}</span>
          </h2>
        ) : null}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
          {memories.map((m) => (
            <Link
              key={m.seed}
              href={m.link}
              id={`home-memory-circle-${m.seed}`}
              className="memory-circle group text-center reveal"
            >
              <div className="relative aspect-square rounded-full overflow-hidden mx-auto w-32 md:w-36">
                {m.imgUrl ? (
                  <Image
                    src={m.imgUrl}
                    fill
                    sizes="144px"
                    className="object-cover grayscale"
                    alt={`Retrato histórico de ${m.name}`}
                  />
                ) : null}
              </div>

              {m.name ? (
                <p className="mt-5 text-[13px] text-ink/70 font-light leading-snug px-2">
                  {m.name}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
