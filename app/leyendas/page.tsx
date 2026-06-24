import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leyendas — Casa Norden",
  description: "Leyendas y mitos de Concepción del Uruguay y el Arroyo de la China.",
};

const LEGENDS = [
  {
    seed: "delfina-leyenda",
    tag: "Amor y guerra",
    title: "La Delfina",
    img: "/images/delfina-portrait.jpg",
    text:
      "Cautiva portuguesa de cabellos rubios, supuesta hija ilegítima de un virrey del Brasil. Compañera inseparable de Francisco Ramírez, lo siguió en sus campañas y, tras su muerte, regresó a vagar por estas tierras. ¿Mito o leyenda? Su acta de defunción aún se conserva.",
  },
  {
    seed: "salamanca-leyenda",
    tag: "Las aguas del misterio",
    title: "La Salamanca",
    img: "/images/salamanca-leyenda.jpg",
    text:
      "Dicen que en las aguas de la Salamanca habita el «Mheribé», un fantasma de agua. Cuentan que un cacique minuán fue transformado en una criatura que no era ni hombre ni pez: sus piernas se volvieron cola, sus brazos aletas, su cabello escamas, antes de hundirse para siempre en la laguna.",
  },
  {
    seed: "jinete-leyenda",
    tag: "El Arroyo El Gato",
    title: "El jinete invisible",
    img: "/images/jinete-leyenda.jpg",
    text:
      "En el Arroyo El Gato, en el departamento Uruguay, los lugareños aseguran que de noche se escucha el trote de un jinete que nunca se ve. Una de las tantas creencias del pago chico que aún sobreviven en la voz de los más viejos.",
  },
];

export default function LeyendasPage() {
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
          {LEGENDS.map((l, i) => {
            const reversed = i % 2 === 1;
            return (
              <article
                key={l.seed}
                id={`legend-article-${l.seed}`}
                className="leg grid md:grid-cols-2 gap-10 lg:gap-16 items-center reveal"
              >
                <div className={`relative overflow-hidden aspect-[4/3] ${reversed ? "md:order-2" : ""}`}>
                  <Image
                    src={l.img}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="leg-img object-cover grayscale"
                    alt={`Ilustración de la leyenda de ${l.title}`}
                  />
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
