import Image from "next/image";
import type { Metadata } from "next";
import { getHistoriaGlobal, getMediaUrl } from "@/lib/payload";

export const metadata: Metadata = {
  title: "La Historia Detrás de una Ciudad — Casa Norden",
  description:
    "Casa Norden y la historia de Concepción del Uruguay, Entre Ríos. Quiénes somos.",
};

export default async function HistoriaPage() {
  const data = await getHistoriaGlobal();

  const hero = data?.hero || {};
  const mission = data?.mission || {};
  const vision = data?.vision || {};
  const values = Array.isArray(data?.values) ? data.values : [];

  const heroImgUrl = getMediaUrl(hero.img, "/images/casanorden-rio.jpg");
  const subImgUrl = getMediaUrl(vision.subImg, "/images/cdu-ciudad.jpg");

  return (
    <main>
      <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
        {heroImgUrl ? (
          <Image
            src={heroImgUrl}
            fill
            priority
            sizes="100vw"
            className="hero-img object-cover"
            alt="Río Uruguay al amanecer en Concepción del Uruguay"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
          <p className="eyebrow text-[11px] uppercase text-white/80 mb-6 reveal in">
            Quiénes somos
          </p>
          <h1 className="font-serif font-light text-white text-4xl md:text-6xl lg:text-7xl uppercase leading-none max-w-4xl reveal in">
            {hero.title || "La historia detrás de una ciudad"}
          </h1>
          {hero.text ? (
            <p className="mt-7 max-w-xl text-white/85 font-light text-lg leading-relaxed reveal in">
              {hero.text}
            </p>
          ) : null}
        </div>
      </section>

      <section className="bg-stone py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          {mission.title ? (
            <p className="eyebrow text-[11px] uppercase text-ink/45 mb-8 text-center reveal">
              {mission.title}
            </p>
          ) : null}
          {mission.text ? (
            <p className="font-serif text-2xl md:text-3xl font-light leading-relaxed text-ink/85 text-center reveal">
              {mission.text}
            </p>
          ) : null}
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative overflow-hidden aspect-[4/5] reveal">
            {subImgUrl ? (
              <Image
                src={subImgUrl}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                alt="Calle colonial de adoquines en Concepción del Uruguay"
              />
            ) : null}
          </div>
          <div className="reveal">
            <p className="text-[11px] uppercase tracking-wide-nav text-ink/45 mb-4">
              A orillas del Arroyo de la China
            </p>
            {vision.subTitle ? (
              <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight">
                {vision.subTitle}
              </h2>
            ) : null}
            {vision.subText ? (
              <div className="mt-6 text-ink/70 font-light leading-relaxed text-lg whitespace-pre-line">
                {vision.subText}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-ink text-stone py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <h2 className="text-center text-[12px] md:text-sm uppercase tracking-mega text-stone/70 mb-16 reveal">
            Nuestro <span className="font-medium">propósito</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {values.map((v: any, index: number) => (
              <div key={v?.n || index} className="text-center reveal">
                <p className="font-serif text-5xl text-stone/30 mb-4">{v?.n}</p>
                <h3 className="font-serif text-2xl mb-3">{v?.title}</h3>
                <p className="text-stone/60 font-light leading-relaxed">{v?.text}</p>
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
            id="historia-contact-btn"
            className="mt-9 btn-dark inline-block border border-ink/70 text-ink text-[11px] uppercase tracking-wide-nav px-9 py-4"
          >
            Contáctenos
          </a>
        </div>
      </section>
    </main>
  );
}
