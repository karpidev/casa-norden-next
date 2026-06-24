import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/images/casanorden-rio.jpg"
          alt="Vista poética en blanco y negro del Río Uruguay al amanecer"
          fill
          priority
          sizes="100vw"
          className="hero-img object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70" />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
          <p className="eyebrow text-[11px] md:text-xs uppercase text-white/80 mb-6 reveal">
            Perpetual Memorial
          </p>
          <h1 className="hero-title font-serif font-light text-white text-5xl md:text-7xl lg:text-8xl uppercase max-w-4xl reveal">
            Perpetuar
            <br />
            la memoria
          </h1>
          <p className="mt-8 max-w-md text-white/85 font-light text-base md:text-lg leading-relaxed reveal">
            Honramos a quienes fueron, los lugares que habitaron y las historias
            que dejaron en la tierra de Concepción del Uruguay.
          </p>
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
          <h2 className="text-center text-[12px] md:text-sm uppercase tracking-mega text-ink/80 mb-16 reveal">
            Memorias <span className="font-medium">Destacadas</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
            {[
              { seed: "urquiza", name: "Justo José de Urquiza", img: "/images/urquiza.jpg" },
              { seed: "ramirez", name: "Francisco Ramírez", img: "/images/ramirez.jpg" },
              { seed: "delavega", name: "La Delfina", img: "/images/delfina-portrait.jpg" },
              { seed: "bredeston", name: "Guillermo Bredeston", img: "/images/bredeston-portrait.jpg" },
              { seed: "chamot", name: "José Chamot", img: "/images/chamot-portrait.jpg" },
            ].map((m) => (
              <Link
                key={m.seed}
                href="/memorias"
                id={`home-memory-circle-${m.seed}`}
                className="memory-circle group text-center reveal"
              >
                <div className="relative aspect-square rounded-full overflow-hidden mx-auto w-32 md:w-36">
                  <Image
                    src={m.img}
                    fill
                    sizes="144px"
                    className="object-cover grayscale"
                    alt={`Retrato histórico de ${m.name}`}
                  />
                </div>
                <p className="mt-5 text-[13px] text-ink/70 font-light leading-snug px-2">
                  {m.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MEMORIAS QUE PERDURAN */}
      <section className="relative bg-ink text-stone py-28 lg:py-40 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow text-[11px] uppercase text-stone/60 mb-8 reveal">
            Memorias que perduran
          </p>
          <h2 className="font-serif font-light text-4xl md:text-6xl uppercase max-w-3xl leading-tight reveal">
            Historias que
            <br />
            resisten al tiempo
          </h2>
          <p className="mt-8 max-w-2xl text-stone/70 font-light text-lg leading-relaxed reveal">
            Cada vida deja una huella en su comunidad. En Casa Norden reunimos
            los relatos de quienes ayudaron a forjar una ciudad, para que las
            próximas generaciones los lleven consigo.
          </p>
          <div className="relative mt-16 h-[420px] md:h-[560px] reveal">
            <Image
              src="/images/casanorden-earth.jpg"
              fill
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover"
              alt="Detalle en primer plano de la tierra fértil y raíces de un ombú antiguo"
            />
          </div>
        </div>
      </section>

      {/* LUGARES CON HISTORIA */}
      <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
        <Image
          src="/images/palacio-sanjose.jpg"
          fill
          sizes="100vw"
          className="object-cover"
          alt="Fachada simétrica en blanco y negro del Palacio San José"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
          <p className="eyebrow text-[11px] uppercase text-white/80 mb-6 reveal">
            Lugares con Historia
          </p>
          <h2 className="font-serif font-light text-white text-4xl md:text-6xl uppercase max-w-2xl leading-tight reveal">
            «La Histórica»
            <br />
            en cada esquina
          </h2>
          <p className="mt-7 max-w-xl text-white/85 font-light text-lg leading-relaxed reveal">
            El Palacio San José, la Basílica de la Inmaculada Concepción, la
            Plaza Ramírez y el Colegio del Uruguay guardan los acontecimientos
            que dieron forma al federalismo argentino.
          </p>
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
          <h2 className="text-[12px] md:text-sm uppercase tracking-mega text-ink/80 mb-14 reveal">
            Más <span className="font-medium">Destacado</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { href: "/memorias", seed: "caudillo", tag: "Memorias", title: "El Supremo Entrerriano", img: "/images/ramirez.jpg" },
              { href: "/lugares", seed: "colegio-c", tag: "Lugares", title: "Colegio del Uruguay", img: "/images/colegio.jpg" },
              { href: "/fechas", seed: "pronunciamiento", tag: "Fechas Recordadas", title: "1 de mayo de 1851", img: "/images/plaza-ramirez.jpg" },
              { href: "/leyendas", seed: "salamanca", tag: "Leyendas", title: "La Salamanca", img: "/images/salamanca-leyenda.jpg" },
            ].map((c) => (
              <Link key={c.seed} href={c.href} id={`home-card-${c.seed}`} className="card group reveal">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <Image
                    src={c.img}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="card-img object-cover"
                    alt={`Ilustración representativa de ${c.title}`}
                  />
                </div>
                <p className="mt-5 text-[11px] uppercase tracking-wide-nav text-ink/50">
                  {c.tag}
                </p>
                <h3 className="mt-1 font-serif text-2xl text-ink leading-snug">
                  {c.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA HISTORIA */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="/images/cdu-ciudad.jpg"
          fill
          sizes="100vw"
          className="object-cover"
          alt="Calle de adoquines colonial en Concepción del Uruguay"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center items-start">
          <p className="eyebrow text-[11px] uppercase text-white/80 mb-5 reveal">
            Casa Norden
          </p>
          <h2 className="font-serif font-light text-white text-4xl md:text-6xl uppercase max-w-3xl leading-tight reveal">
            La historia detrás
            <br />
            de una ciudad
          </h2>
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
