import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import client from "@/tina/__generated__/client";

export const metadata: Metadata = {
  title: "Lugares con Historia — Casa Norden",
  description:
    "Los sitios históricos de Concepción del Uruguay: Palacio San José, Basílica de la Inmaculada, Plaza Ramírez y el Colegio del Uruguay.",
};

export default async function LugaresPage() {
  const res = await client.queries.lugaresConnection();
  const places = res.data.lugaresConnection.edges?.map(edge => edge?.node) || [];

  return (
    <main>
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <Image
          src="/images/cdu-ciudad.jpg"
          fill
          priority
          sizes="100vw"
          className="hero-img object-cover"
          alt="Calle colonial de adoquines con faroles históricos en Concepción del Uruguay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/70" />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
          <p className="eyebrow text-[11px] uppercase text-white/80 mb-6 reveal in">
            «La Histórica»
          </p>
          <h1 className="font-serif font-light text-white text-5xl md:text-7xl uppercase leading-none reveal in">
            Lugares con
            <br />
            historia
          </h1>
          <p className="mt-7 max-w-xl text-white/85 font-light text-lg leading-relaxed reveal in">
            Piedras y muros que fueron testigos del nacimiento del federalismo
            argentino, a orillas del río Uruguay.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid sm:grid-cols-2 gap-x-10 gap-y-16">
          {places.map((p) => {
            if (!p) return null;
            const seed = p.id.split('/').pop()?.replace('.md', '') || `place-${p.title}`;
            return (
              <article key={p.id} id={`places-card-${seed}`} className="card group reveal">
                <div className="relative overflow-hidden aspect-[16/10]">
                  {p.img && (
                    <Image
                      src={p.img}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="card-img object-cover"
                      alt={`Fachada de ${p.title}`}
                    />
                  )}
                </div>
                <p className="mt-6 text-[11px] uppercase tracking-wide-nav text-ink/45">
                  {p.tag}
                </p>
                <h2 className="mt-1 font-serif text-3xl md:text-4xl font-light">
                  {p.title}
                </h2>
                <p className="mt-4 text-ink/70 font-light leading-relaxed text-lg">
                  {p.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="/images/casanorden-rio.jpg"
          fill
          sizes="100vw"
          className="object-cover"
          alt="Vista poética del Río Uruguay en la zona histórica de Concepción del Uruguay"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
          <p className="eyebrow text-[11px] uppercase text-white/80 mb-5 reveal">
            Arroyo de la China
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white max-w-2xl leading-tight reveal">
            Donde Tomás de Rocamora fundó la ciudad en 1783
          </h2>
          <Link
            href="/fechas"
            id="lugares-timeline-btn"
            className="mt-8 btn-ghost inline-block border border-white/70 text-white text-[11px] uppercase tracking-wide-nav px-9 py-4 reveal"
          >
            Ver línea de tiempo
          </Link>
        </div>
      </section>
    </main>
  );
}
