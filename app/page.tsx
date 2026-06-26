import Link from "next/link";
import Image from "next/image";
import client from "@/tina/__generated__/client";

export default async function Home() {
  const res = await client.queries.home({ relativePath: "info.md" });
  const data = res.data.home;
  
  const featuredMemories = data.featuredMemories || [];
  const moreFeatured = data.moreFeatured || [];

  return (
    <main>
      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        {data.heroImg ? (
          <Image
            src={data.heroImg}
            alt={data.heroText || "Vista de Casa Norden"}
            fill
            priority
            sizes="100vw"
            className="hero-img object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
          {data.heroEyebrow ? (
            <p className="eyebrow text-[11px] md:text-xs uppercase text-white/80 mb-6 reveal">
              {data.heroEyebrow}
            </p>
          ) : null}
          {data.heroTitle ? (
            <h1 className="hero-title font-serif font-light text-white text-5xl md:text-7xl lg:text-8xl uppercase max-w-4xl reveal whitespace-pre-line">
              {data.heroTitle}
            </h1>
          ) : null}
          {data.heroText ? (
            <p className="mt-8 max-w-md text-white/85 font-light text-base md:text-lg leading-relaxed reveal">
              {data.heroText}
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* MEMORIAS DESTACADAS */}
      <section className="bg-stone py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {data.featuredMemoriesTitle ? (
            <h2 className="text-center text-[12px] md:text-sm uppercase tracking-mega text-ink/80 mb-16 reveal">
              {data.featuredMemoriesTitle.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="font-medium">{data.featuredMemoriesTitle.split(" ").pop()}</span>
            </h2>
          ) : null}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
            {featuredMemories.map((m: any, index: number) => {
              if (!m) return null;
              const seed = m.name?.toLowerCase().replace(/[^a-z0-9]/g, "") || `memory-${index}`;
              const linkUrl = m.link || "/memorias";
              return (
                <Link
                  key={seed}
                  href={linkUrl}
                  id={`home-memory-circle-${seed}`}
                  className="memory-circle group text-center reveal"
                >
                  <div className="relative aspect-square rounded-full overflow-hidden mx-auto w-32 md:w-36">
                    {m.img ? (
                      <Image
                        src={m.img}
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
              );
            })}
          </div>
        </div>
      </section>

      {/* MEMORIAS QUE PERDURAN */}
      <section className="relative bg-ink text-stone py-28 lg:py-40 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {data.aboutEyebrow ? (
            <p className="eyebrow text-[11px] uppercase text-stone/60 mb-8 reveal">
              {data.aboutEyebrow}
            </p>
          ) : null}
          {data.aboutTitle ? (
            <h2 className="font-serif font-light text-4xl md:text-6xl uppercase max-w-3xl leading-tight reveal whitespace-pre-line">
              {data.aboutTitle}
            </h2>
          ) : null}
          {data.aboutText ? (
            <p className="mt-8 max-w-2xl text-stone/70 font-light text-lg leading-relaxed reveal">
              {data.aboutText}
            </p>
          ) : null}
          {data.aboutImg ? (
            <div className="relative mt-16 h-[420px] md:h-[560px] reveal">
              <Image
                src={data.aboutImg}
                fill
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-cover"
                alt="Detalle en primer plano del Memorial"
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* LUGARES CON HISTORIA */}
      <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
        {data.placesImg ? (
          <Image
            src={data.placesImg}
            fill
            sizes="100vw"
            className="object-cover"
            alt="Palacio San José u otro lugar histórico"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
          {data.placesEyebrow ? (
            <p className="eyebrow text-[11px] uppercase text-white/80 mb-6 reveal">
              {data.placesEyebrow}
            </p>
          ) : null}
          {data.placesTitle ? (
            <h2 className="font-serif font-light text-white text-4xl md:text-6xl uppercase max-w-2xl leading-tight reveal whitespace-pre-line">
              {data.placesTitle}
            </h2>
          ) : null}
          {data.placesText ? (
            <p className="mt-7 max-w-xl text-white/85 font-light text-lg leading-relaxed reveal">
              {data.placesText}
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

      {/* MÁS DESTACADO */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {data.moreFeaturedTitle ? (
            <h2 className="text-[12px] md:text-sm uppercase tracking-mega text-ink/80 mb-14 reveal">
              {data.moreFeaturedTitle.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="font-medium">{data.moreFeaturedTitle.split(" ").pop()}</span>
            </h2>
          ) : null}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {moreFeatured.map((c: any, index: number) => {
              if (!c) return null;
              const seed = c.title?.toLowerCase().replace(/[^a-z0-9]/g, "") || `featured-${index}`;
              const linkUrl = c.href || "/";
              return (
                <Link key={seed} href={linkUrl} id={`home-card-${seed}`} className="card group reveal">
                  <div className="relative overflow-hidden aspect-[4/5]">
                    {c.img ? (
                      <Image
                        src={c.img}
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
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA HISTORIA */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {data.ctaImg ? (
          <Image
            src={data.ctaImg}
            fill
            sizes="100vw"
            className="object-cover"
            alt="Calle colonial de Concepción del Uruguay"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center items-start">
          {data.ctaEyebrow ? (
            <p className="eyebrow text-[11px] uppercase text-white/80 mb-5 reveal">
              {data.ctaEyebrow}
            </p>
          ) : null}
          {data.ctaTitle ? (
            <h2 className="font-serif font-light text-white text-4xl md:text-6xl uppercase max-w-3xl leading-tight reveal whitespace-pre-line">
              {data.ctaTitle}
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
    </main>
  );
}
