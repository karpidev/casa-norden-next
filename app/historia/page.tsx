import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "La Historia Detrás de una Ciudad — Casa Norden",
  description:
    "Casa Norden y la historia de Concepción del Uruguay, Entre Ríos. Quiénes somos.",
};

const VALUES = [
  {
    n: "I",
    title: "Honrar",
    text:
      "Acompañamos cada despedida con respeto, calidez y la dignidad que cada vida merece.",
  },
  {
    n: "II",
    title: "Preservar",
    text:
      "Guardamos las memorias, los lugares y los relatos para que perduren más allá del tiempo.",
  },
  {
    n: "III",
    title: "Trascender",
    text:
      "Convertimos el recuerdo en legado, para que las próximas generaciones lo lleven consigo.",
  },
];

export default function HistoriaPage() {
  return (
    <main>
      <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
        <Image
          src="https://picsum.photos/seed/cdu-historia/1920/1200?grayscale"
          fill
          priority
          sizes="100vw"
          className="hero-img object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
          <p className="eyebrow text-[11px] uppercase text-white/80 mb-6 reveal in">
            Quiénes somos
          </p>
          <h1 className="font-serif font-light text-white text-4xl md:text-6xl lg:text-7xl uppercase leading-none max-w-4xl reveal in">
            La historia detrás
            <br />
            de una ciudad
          </h1>
          <p className="mt-7 max-w-xl text-white/85 font-light text-lg leading-relaxed reveal in">
            Concepción del Uruguay, «La Histórica». El lugar que nos dio nombre,
            propósito y memoria.
          </p>
        </div>
      </section>

      <section className="bg-stone py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <p className="eyebrow text-[11px] uppercase text-ink/45 mb-8 text-center reveal">
            Casa Norden · Perpetual Memorial
          </p>
          <p className="font-serif text-2xl md:text-3xl font-light leading-relaxed text-ink/85 text-center reveal">
            Nacimos del convencimiento de que ninguna vida debería olvidarse.
            Acompañamos a las familias de Concepción del Uruguay en el adiós, y
            preservamos la memoria de las personas, los lugares y las historias
            que dan alma a nuestra ciudad.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative overflow-hidden aspect-[4/5] reveal">
            <Image
              src="https://picsum.photos/seed/ciudad-rocamora/800/1000?grayscale"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              alt=""
            />
          </div>
          <div className="reveal">
            <p className="text-[11px] uppercase tracking-wide-nav text-ink/45 mb-4">
              A orillas del Arroyo de la China
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight">
              Una ciudad que forjó una Nación
            </h2>
            <p className="mt-6 text-ink/70 font-light leading-relaxed text-lg">
              Fundada el 25 de junio de 1783 por Tomás de Rocamora, Concepción
              del Uruguay fue cuna del federalismo argentino. Aquí Francisco
              Ramírez proclamó la República de Entre Ríos, y desde aquí Justo
              José de Urquiza impulsó la organización nacional que culminó en la
              Constitución de 1853.
            </p>
            <p className="mt-5 text-ink/70 font-light leading-relaxed text-lg">
              Sus calles, su colegio y su basílica le valieron el nombre con que
              todos la conocen: «La Histórica».
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ink text-stone py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <h2 className="text-center text-[12px] md:text-sm uppercase tracking-mega text-stone/70 mb-16 reveal">
            Nuestro <span className="font-medium">propósito</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {VALUES.map((v) => (
              <div key={v.n} className="text-center reveal">
                <p className="font-serif text-5xl text-stone/30 mb-4">{v.n}</p>
                <h3 className="font-serif text-2xl mb-3">{v.title}</h3>
                <p className="text-stone/60 font-light leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone py-24 lg:py-32">
        <div className="max-w-2xl mx-auto px-6 text-center reveal">
          <p className="eyebrow text-[11px] uppercase text-ink/45 mb-6">
            Estamos para acompañarle
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight">
            Hablemos de cómo
            <br />
            perpetuar una memoria
          </h2>
          <p className="mt-6 text-ink/65 font-light text-lg">
            Concepción del Uruguay, Entre Ríos, Argentina
          </p>
          <a
            href="mailto:contacto@casanorden.com.ar"
            className="mt-9 btn-dark inline-block border border-ink/70 text-ink text-[11px] uppercase tracking-wide-nav px-9 py-4"
          >
            Contáctenos
          </a>
        </div>
      </section>
    </main>
  );
}
