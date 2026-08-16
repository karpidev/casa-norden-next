import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getMemorias, getMediaUrl } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Memorias",
  description:
    "Memorias de las personas que dejaron su huella en Concepción del Uruguay, Entre Ríos.",
  alternates: {
    canonical: "/memorias",
  },
};

export default async function MemoriasPage() {
  const people = await getMemorias();

  return (
    <main>
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <Image
          src="/images/casanorden-rio.jpg"
          fill
          priority
          sizes="100vw"
          className="hero-img object-cover"
          alt="Vista poética del Río Uruguay en Concepción del Uruguay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/70" />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
          <p className="eyebrow text-[11px] uppercase text-white/80 mb-6 reveal in">
            Perpetual Memorial
          </p>
          <h1 className="font-serif font-light text-white text-5xl md:text-7xl uppercase leading-none reveal in">
            Memorias
          </h1>
          <p className="mt-7 max-w-xl text-white/85 font-light text-lg leading-relaxed reveal in">
            Las vidas de quienes forjaron una ciudad y trascendieron sus calles.
            Honramos su legado para que perdure.
          </p>
        </div>
      </section>

      <section className="bg-stone py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center reveal">
          <p className="font-serif text-2xl md:text-3xl font-light leading-relaxed text-ink/85">
            «La memoria es el único cementerio que nunca cierra sus puertas.»
            Reunimos los retratos de hombres y mujeres nacidos a orillas del
            Arroyo de la China, cuya obra sigue viva.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 space-y-24">
          {people.map((p, i) => {
            if (!p) return null;
            const reversed = i % 2 === 1;
            const seed = p.slug || `person-${p.id || i}`;
            const personImgUrl = getMediaUrl(p.img, "/images/urquiza.jpg");
            return (
              <article
                key={p.id}
                id={`memorias-article-${seed}`}
                className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center card group reveal"
              >
                <div className={`relative overflow-hidden aspect-[4/3] ${reversed ? "md:order-2" : ""}`}>
                  {personImgUrl ? (
                    <Image
                      src={personImgUrl}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="card-img object-cover"
                      alt={`Retrato representativo de ${p.name}`}
                    />
                  ) : null}
                </div>
                <div className={reversed ? "md:order-1" : ""}>
                  {p.years ? (
                    <p className="text-[11px] uppercase tracking-wide-nav text-ink/45 mb-3">
                      {p.years}
                    </p>
                  ) : null}
                  <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight">
                    {p.name}
                  </h2>
                  {p.text ? (
                    <p className="mt-5 text-ink/70 font-light leading-relaxed text-lg">
                      {p.text}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-ink text-stone py-24 text-center">
        <div className="max-w-2xl mx-auto px-6 reveal">
          <p className="eyebrow text-[11px] uppercase text-stone/50 mb-6">
            Casa Norden
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-light leading-tight">
            ¿Desea perpetuar la memoria de un ser querido?
          </h2>
          <Link
            href="/historia"
            id="memorias-contact-btn"
            className="mt-8 btn-ghost inline-block border border-white/60 text-stone text-[11px] uppercase tracking-wide-nav px-9 py-4"
          >
            Contáctenos
          </Link>
        </div>
      </section>
    </main>
  );
}
