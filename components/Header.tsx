"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/memorias", label: "Memorias" },
  { href: "/lugares", label: "Lugares con Historia" },
  { href: "/fechas", label: "Fechas Recordadas" },
  { href: "/leyendas", label: "Leyendas" },
  { href: "/historia", label: "La Historia Detrás de una Ciudad" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlay and reset scroll lock on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`site-header fixed top-0 left-0 w-full z-50 ${
          scrolled ? "solid bg-stone text-ink shadow-sm" : "text-white"
        }`}
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none transition-opacity duration-500"
          style={{ opacity: scrolled ? 0 : 1 }}
        />
        <nav className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between py-5">
            <button
              className="flex items-center gap-3 text-[11px] uppercase tracking-wide-nav font-light"
              aria-label="Menú"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block w-5 h-px bg-current" />
                <span className="block w-5 h-px bg-current" />
              </span>
              <span className="hidden sm:inline">Menú</span>
            </button>

            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <Image
                src="/logo-casa-norden.png"
                alt="Casa Norden"
                width={622}
                height={63}
                priority
                className="logo-img h-5 md:h-6 w-auto"
              />
            </Link>

            <button
              className="flex items-center gap-2 text-[11px] uppercase tracking-wide-nav font-light"
              aria-label="Buscar"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center justify-center gap-10 pb-4 text-[11px] uppercase font-light tracking-wide-nav">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${active ? "border-b border-current pb-1" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-[60] text-stone flex-col items-center justify-center ${
          open ? "flex" : "hidden"
        }`}
        style={{ backgroundColor: "#0c0c0d" }}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-7 right-8 text-3xl font-light"
          aria-label="Cerrar"
        >
          &times;
        </button>
        <nav className="flex flex-col items-center gap-7 text-2xl font-serif">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:opacity-60 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
