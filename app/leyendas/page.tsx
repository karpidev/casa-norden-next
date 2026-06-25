import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import client from "@/tina/__generated__/client";

export const metadata: Metadata = {
  title: "Leyendas — Casa Norden",
  description: "Leyendas y mitos de Concepción del Uruguay y el Arroyo de la China.",
};

export default async function LeyendasPage() {
  const res = await client.queries.leyendasConnection();
  const legends = res.data.leyendasConnection.edges?.map(edge => edge?.node) || [];

  return (
    <main className="text-stone">
      <section className="relative h-[75vh] min-h-[500px] w-full overflow-hidden">
        <Image
          src="/images/leyendas-niebla.jpg"
          fill
          priority
          sizes="100vw"
          className="hero-img object-cover"
          alt="Paisaje brumoso y misterioso en el Río Uruguay al atardecer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-ink" />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
          <p className="eyebrow text-[11px] uppercase text-white/80 mb-6 reveal in">
            Mitos del pago chico
          </p>
          <h1 className="font-serif font-light text-white text-5xl md:text-7xl uppercase leading-none reveal in">
            Leyendas
          </h1>
          <p className="mt-7 max-w-xl text-white/85 font-light text-lg leading-relaxed reveal in">
            Susurros que el río Uruguay arrastra desde hace siglos. Relatos
            donde la historia se confunde con el misterio.
          </p>
        </div>
      </section>

      <section className="bg-ink py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 space-y-28">
          {legends.map((l, i) => {
            if (!l) return null;
            const reversed = i % 2 === 1;
            const seed = l.id.split('/').pop()?.replace('.md', '') || `legend-${i}`;
            return (
              <article
                key={l.id}
                id={`legend-article-${seed}`}
                className="leg grid md:grid-cols-2 gap-10 lg:gap-16 items-center reveal"
              >
                <div className={`relative overflow-hidden aspect-[4/3] ${reversed ? "md:order-2" : ""}`}>
                  {l.img && (
                    <Image
                      src={l.img}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="leg-img object-cover grayscale"
                      alt={`Ilustración de la leyenda de ${l.title}`}
                    />
                  )}
                </div>
                <div className={reversed ? "md:order-1" : ""}>
                  <p className="text-[11px] uppercase tracking-wide-nav text-stone/40 mb-3">
                    {l.tag}
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl font-light text-stone leading-tight">
                    {l.title}
                  </h2>
                  <p className="mt-5 text-stone/65 font-light leading-relaxed text-lg">
                    {l.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
        <Image
          src="/images/rio-noche.jpg"
          fill
          sizes="100vw"
          className="object-cover"
          alt="El Río Uruguay bajo un cielo estrellado y con reflejo lunar"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center items-center text-center">
          <p className="font-serif text-3xl md:text-4xl font-light text-white max-w-2xl leading-snug reveal">
            «Mientras alguien las recuerde, las leyendas nunca mueren.»
          </p>
          <Link
            href="/historia"
            id="leyendas-history-btn"
            className="mt-8 btn-ghost inline-block border border-white/70 text-white text-[11px] uppercase tracking-wide-nav px-9 py-4 reveal"
          >
            La historia de la ciudad
          </Link>
        </div>
      </section>
    </main>
  );
}
