import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fechas Recordadas — Casa Norden",
  description:
    "Línea de tiempo de los hechos que marcaron a Concepción del Uruguay, Entre Ríos.",
};

const EVENTS = [
  {
    year: "1783",
    title: "Fundación de la ciudad",
    text:
      "El 25 de junio, Tomás de Rocamora funda Concepción del Uruguay a orillas del Arroyo de la China.",
  },
  {
    year: "1786",
    title: "Nace Francisco Ramírez",
    text:
      "El 13 de marzo nace el «Supremo Entrerriano», futuro creador de la República de Entre Ríos.",
  },
  {
    year: "1820",
    title: "La República de Entre Ríos",
    text:
      "Francisco Ramírez proclama la República de Entre Ríos, con capital en Concepción del Uruguay.",
  },
  {
    year: "1849",
    title: "El Colegio del Uruguay",
    text:
      "Urquiza funda el primer colegio laico, público y gratuito del país. Su edificio se habilita en 1851.",
  },
  {
    year: "1851",
    title: "El Pronunciamiento de Urquiza",
    text:
      "El 1 de mayo, frente a la Plaza Ramírez, Urquiza se pronuncia contra Rosas. Comienza el camino a la organización nacional.",
  },
  {
    year: "1853",
    title: "La Constitución Nacional",
    text:
      "Tras Caseros, se sanciona la Constitución de 1853, con Urquiza como primer presidente constitucional.",
  },
  {
    year: "1870",
    title: "El final de Urquiza",
    text:
      "El 11 de abril, Justo José de Urquiza es asesinado en el Palacio San José, cerrando una era.",
  },
  {
    year: "1942",
    title: "Patrimonio nacional",
    text:
      "La Basílica y el Colegio del Uruguay son declarados Monumentos Históricos Nacionales.",
  },
];

export default function FechasPage() {
  return (
    <main className="text-stone">
      <section className="relative h-[65vh] min-h-[440px] w-full overflow-hidden">
        <Image
          src="https://picsum.photos/seed/fechas-hero/1920/1100?grayscale"
          fill
          priority
          sizes="100vw"
          className="hero-img object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-ink" />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
          <p className="eyebrow text-[11px] uppercase text-white/80 mb-6 reveal in">
            Línea de tiempo
          </p>
          <h1 className="font-serif font-light text-white text-5xl md:text-7xl uppercase leading-none reveal in">
            Fechas
            <br />
            recordadas
          </h1>
          <p className="mt-7 max-w-xl text-white/85 font-light text-lg leading-relaxed reveal in">
            Los días que dieron forma a una ciudad y, con ella, a la Nación.
          </p>
        </div>
      </section>

      <section className="bg-ink py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-stone/15 md:-translate-x-1/2" />
            {EVENTS.map((e, i) => {
              const right = i % 2 === 1;
              return (
                <div
                  key={e.year}
                  className={`relative md:grid md:grid-cols-2 md:gap-12 reveal ${
                    i === EVENTS.length - 1 ? "" : "mb-16 md:mb-20"
                  }`}
                >
                  <div
                    className={
                      right
                        ? "md:order-2 md:pl-12"
                        : "md:text-right md:pr-12"
                    }
                  >
                    <span className="absolute left-4 md:left-1/2 top-1 w-3 h-3 rounded-full bg-stone tl-dot md:-translate-x-1/2" />
                    <p className="pl-12 md:pl-0 font-serif text-4xl md:text-5xl text-stone/90">
                      {e.year}
                    </p>
                  </div>
                  <div
                    className={`pl-12 md:pl-0 mt-2 md:mt-0 ${
                      right ? "md:order-1 md:text-right md:pr-12" : ""
                    }`}
                  >
                    <h3 className="font-serif text-2xl text-stone">{e.title}</h3>
                    <p className="mt-2 text-stone/60 font-light leading-relaxed">
                      {e.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
