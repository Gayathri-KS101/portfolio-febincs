"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Page-wide behaviour that needs no markup of its own:
// - tells a `.holo` element where the pointer is over it, for its light and sheen
// - leans a `.tilt` element towards the pointer
// - flips the whole screen to cream while a `.section-paper` section holds mid-screen
export default function Effects() {
  const pathname = usePathname();

  // the cream sections of whichever page is showing
  useEffect(() => {
    const root = document.documentElement;
    const holding = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) holding.add(entry.target);
          else holding.delete(entry.target);
        }
        // the palette lives on <html>, so the nav and every section on screen change together
        if (holding.size) root.dataset.theme = "paper";
        else delete root.dataset.theme;
      },
      // a thin band across the middle of the screen: a section holds it while it crosses it
      { rootMargin: "-46% 0px -46% 0px" },
    );
    document.querySelectorAll(".section-paper").forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      delete root.dataset.theme;
    };
  }, [pathname]);

  useEffect(() => {
    let leaning: HTMLElement | null = null;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !(event.target instanceof Element)) return;

      const holo = event.target.closest<HTMLElement>(".holo");
      if (holo) {
        const box = holo.getBoundingClientRect();
        holo.style.setProperty("--mx", `${event.clientX - box.left}px`);
        holo.style.setProperty("--my", `${event.clientY - box.top}px`);
      }

      const tilt = event.target.closest<HTMLElement>(".tilt");
      if (leaning && leaning !== tilt) {
        leaning.style.removeProperty("--tilt-x");
        leaning.style.removeProperty("--tilt-y");
      }
      if (tilt) {
        const box = tilt.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        tilt.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
        tilt.style.setProperty("--tilt-y", `${(x * 9).toFixed(2)}deg`);
      }
      leaning = tilt;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}
