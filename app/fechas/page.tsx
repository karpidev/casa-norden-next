import Image from "next/image";
import type { Metadata } from "next";
import client from "@/tina/__generated__/client";

export const metadata: Metadata = {
  title: "Fechas Recordadas — Casa Norden",
  description:
    "Línea de tiempo de los hechos que marcaron a Concepción del Uruguay, Entre Ríos.",
};

export default async function FechasPage() {
  const res = await client.queries.fechasConnection();
  const rawEvents = res.data.fechasConnection.edges?.map(edge => edge?.node) || [];
  
  // Filtrar nulos y ordenar cronológicamente por año
  const events = [...rawEvents.filter((e): e is NonNullable<typeof e> => !!e)]
    .sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      return yearA - yearB;
    });

  return (
    <main className="text-stone">
      <section className="relative h-[65vh] min-h-[440px] w-full overflow-hidden">
        <Image
          src="/images/cdu-ciudad.jpg"
          fill
          priority
          sizes="100vw"
          className="hero-img object-cover"
          alt="Calle histórica empedrada en Concepción del Uruguay"
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
            {events.map((e, i) => {
              const right = i % 2 === 1;
              return (
                <article
                  key={e.id}
                  id={`timeline-event-${e.year}`}
                  className={`relative md:grid md:grid-cols-2 md:gap-12 reveal ${
                    i === events.length - 1 ? "" : "mb-16 md:mb-20"
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
                    <h2 className="font-serif text-2xl text-stone">{e.title}</h2>
                    <p className="mt-2 text-stone/60 font-light leading-relaxed">
                      {e.text}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
