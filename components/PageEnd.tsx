"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import { useTransit } from "@/components/Transit";
import { pages } from "@/content/site";

const tour = [{ href: "/", label: "Home" }, ...pages]; // the order the pages are read in

// What closes every page. On all but the last it is the way on to the next page: keep
// scrolling and a trace charges up; when it is full, the next page loads. The last page
// ends with the footer instead.
export default function PageEnd() {
  const pathname = usePathname();
  const go = useTransit();
  const bandRef = useRef<HTMLElement>(null);

  const here = tour.findIndex((page) => page.href === (pathname.replace(/\/$/, "") || "/"));
  const next = here >= 0 ? tour[here + 1] : undefined;

  useEffect(() => {
    const band = bandRef.current;
    if (!band || !next) return;

    // The Back button puts you at the foot of the page you left, and that must not send
    // you forwards again. So it only arms once you have scrolled yourself (the browser
    // putting the page back where it was does not count) with the band under half charged.
    let touched = false;
    let armed = false;
    let raf = 0;
    const onInput = () => {
      touched = true;
    };
    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

    const update = () => {
      raf = 0;
      const box = band.getBoundingClientRect();
      const charge = Math.min(1, Math.max(0, (window.innerHeight - box.top) / box.height));
      band.style.setProperty("--charge", charge.toFixed(4));
      band.toggleAttribute("data-full", charge > 0.97);
      if (touched && charge < 0.5) armed = true;
      const atFoot = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 3;
      if (armed && atFoot) {
        armed = false;
        go(next.href, next.label);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    inputs.forEach((type) => window.addEventListener(type, onInput, { passive: true }));
    return () => {
      inputs.forEach((type) => window.removeEventListener(type, onInput));
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [next, go]);

  if (!next) return <Footer />;

  return (
    <section className="next" ref={bandRef} aria-label="Next page">
      <div className="next-inner">
        <p className="mono next-count">
          Up next <span aria-hidden="true">/</span> {String(here + 2).padStart(2, "0")} of{" "}
          {String(tour.length).padStart(2, "0")}
        </p>
        <Link
          href={next.href}
          className="next-name"
          onClick={(event) => {
            event.preventDefault();
            go(next.href, next.label);
          }}
        >
          {next.label}
        </Link>
        <div className="next-meter" aria-hidden="true">
          <span className="next-fill" />
          <span className="next-pin" />
        </div>
        <p className="mono next-hint" aria-hidden="true">
          Keep scrolling
        </p>
      </div>
    </section>
  );
}
