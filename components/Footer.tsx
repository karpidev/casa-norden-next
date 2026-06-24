import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "/memorias", label: "Memorias" },
  { href: "/lugares", label: "Lugares" },
  { href: "/fechas", label: "Fechas" },
  { href: "/leyendas", label: "Leyendas" },
  { href: "/historia", label: "La ciudad" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-stone/60 pt-16 pb-10 border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
        <Image
          src="/logo-casa-norden.png"
          alt="Casa Norden"
          width={622}
          height={63}
          className="logo-img h-6 w-auto mx-auto mb-5"
        />
        <p className="text-[11px] uppercase tracking-mega text-stone/40 mb-8">
          Perpetual Memorial · Concepción del Uruguay
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-[11px] uppercase tracking-wide-nav text-stone/50">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-stone">
              {l.label}
            </Link>
          ))}
        </div>
        <p className="mt-8 text-[11px] uppercase tracking-wide-nav text-stone/30">
          © 2026 Casa Norden
        </p>
      </div>
    </footer>
  );
}
