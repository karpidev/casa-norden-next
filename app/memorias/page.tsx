import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memorias — Casa Norden",
  description:
    "Memorias de las personas que dejaron su huella en Concepción del Uruguay, Entre Ríos.",
};

const PEOPLE = [
  {
    seed: "urquiza-mem",
    years: "1801 — 1870 · Estadista",
    name: "Justo José de Urquiza",
    text:
      "Gobernador de Entre Ríos, vencedor de Caseros y primer presidente constitucional de la Confederación Argentina. En 1849 fundó el Colegio del Uruguay, primer establecimiento secular del país. Su vida terminó en el Palacio San José, hoy monumento nacional.",
  },
  {
    seed: "ramirez-mem",
    years: "1786 — 1821 · Caudillo",
    name: "Francisco Ramírez",
    text:
      "El «Supremo Entrerriano». Nacido en Concepción del Uruguay el 13 de marzo de 1786, creó en 1820 la República de Entre Ríos. Símbolo del federalismo, dio nombre a la plaza central de la ciudad.",
  },
  {
    seed: "delfina-mem",
    years: "c. 1790 — 1839 · Figura legendaria",
    name: "La Delfina",
    text:
      "Cautiva portuguesa y compañera de Francisco Ramírez. Su historia, entre el amor y la guerra, quedó grabada en la memoria popular. Según su acta de defunción, fue sepultada en el cementerio local del Arroyo de la China.",
  },
  {
    seed: "bredeston-mem",
    years: "1933 — 2018 · Actor",
    name: "Guillermo Bredeston",
    text:
      "Querido actor del cine y la televisión argentina, nacido en Concepción del Uruguay. Su carrera de más de seis décadas lo convirtió en un emblema de su ciudad natal.",
  },
  {
    seed: "chamot-mem",
    years: "1969 · Futbolista",
    name: "José Antonio Chamot",
    text:
      "Defensor nacido en la ciudad, disputó tres Mundiales consecutivos con la Selección Argentina —1994, 1998 y 2002—, una marca reservada a muy pocos. Orgullo deportivo de «La Histórica».",
  },
];

export default function MemoriasPage() {
  return (
    <main>
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <Image
          src="https://picsum.photos/seed/memorias-hero/1920/1100?grayscale"
          fill
          priority
          sizes="100vw"
          className="hero-img object-cover"
          alt=""
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
          {PEOPLE.map((p, i) => {
            const reversed = i % 2 === 1;
            return (
              <article
                key={p.seed}
                className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center card group reveal"
              >
                <div className={`relative overflow-hidden aspect-[4/3] ${reversed ? "md:order-2" : ""}`}>
                  <Image
                    src={`https://picsum.photos/seed/${p.seed}/800/600?grayscale`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="card-img object-cover"
                    alt=""
                  />
                </div>
                <div className={reversed ? "md:order-1" : ""}>
                  <p className="text-[11px] uppercase tracking-wide-nav text-ink/45 mb-3">
                    {p.years}
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight">
                    {p.name}
                  </h2>
                  <p className="mt-5 text-ink/70 font-light leading-relaxed text-lg">
                    {p.text}
                  </p>
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
            className="mt-8 btn-ghost inline-block border border-white/60 text-stone text-[11px] uppercase tracking-wide-nav px-9 py-4"
          >
            Contáctenos
          </Link>
        </div>
      </section>
    </main>
  );
}
