import Image from 'next/image';
import Link from 'next/link';
import { NormalizedMoreFeaturedProps } from '@/types/cms';

export function MoreFeaturedSection({ title, cards }: NormalizedMoreFeaturedProps) {
  if (!cards || cards.length === 0) return null;

  const titleWords = title ? title.split(' ') : [];
  const mainTitle = titleWords.slice(0, -1).join(' ');
  const highlightWord = titleWords[titleWords.length - 1];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {title ? (
          <h2 className="text-[12px] md:text-sm uppercase tracking-mega text-ink/80 mb-14 reveal">
            {mainTitle} <span className="font-medium">{highlightWord}</span>
          </h2>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((c) => (
            <Link
              key={c.seed}
              href={c.href}
              id={`home-card-${c.seed}`}
              className="card group reveal"
            >
              <div className="relative overflow-hidden aspect-[4/5]">
                {c.imgUrl ? (
                  <Image
                    src={c.imgUrl}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="card-img object-cover"
                    alt={`Ilustración representativa de ${c.title}`}
                  />
                ) : null}
              </div>

              {c.tag ? (
                <p className="mt-5 text-[11px] uppercase tracking-wide-nav text-ink/50">
                  {c.tag}
                </p>
              ) : null}

              {c.title ? (
                <h3 className="mt-1 font-serif text-2xl text-ink leading-snug">
                  {c.title}
                </h3>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
