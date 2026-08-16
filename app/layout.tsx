import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://casanorden.com.ar";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Casa Norden — Perpetual Memorial",
    template: "%s — Casa Norden",
  },
  description:
    "Casa Norden — Perpetual Memorial. Preservamos la memoria de las personas, los lugares y las historias de Concepción del Uruguay, Entre Ríos.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Casa Norden — Perpetual Memorial",
    description:
      "Preservamos la memoria de las personas, los lugares y las historias de Concepción del Uruguay, Entre Ríos.",
    url: baseUrl,
    siteName: "Casa Norden",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Norden — Perpetual Memorial",
    description:
      "Preservamos la memoria de las personas, los lugares y las historias de Concepción del Uruguay, Entre Ríos.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Casa Norden",
    url: baseUrl,
    description:
      "Perpetual Memorial dedicado a preservar la memoria de las personas, lugares e historia de Concepción del Uruguay, Entre Ríos.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Concepción del Uruguay",
      addressRegion: "Entre Ríos",
      addressCountry: "AR",
    },
  };

  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans text-ink antialiased">
        <Header />
        {children}
        <Footer />
        <Reveal />
      </body>
    </html>
  );
}
