"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Observes every element with the `.reveal` class and adds `.in`
 * when it scrolls into view. Re-runs on each route change so that
 * client-side navigations in the App Router are covered too.
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const id = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.in)")
        .forEach((el) => io.observe(el));
    }, 60);

    return () => {
      window.clearTimeout(id);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
