"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  steps: { step: string; detail: string }[];
  children: ReactNode; // the section's heading, which stays put while the cards slide
};

const NAV = 69; // height of the sticky nav, px

// A row of cards that scrolls sideways as the page scrolls down. The section is made
// as tall as the row is wide, and pinned under the nav while the row slides past.
// On phones, and with reduced motion, the cards stack instead and light up one by
// one as they scroll into view.
export default function Rail({ steps, children }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    const frame = track?.parentElement;
    if (!rail || !pin || !track || !frame) return;

    const pinned = window.matchMedia("(min-width: 861px) and (prefers-reduced-motion: no-preference)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = Array.from(track.children);
    let overflow = 0; // how much wider the row is than the window showing it
    let raf = 0;

    const update = () => {
      raf = 0;
      if (pinned.matches) {
        const progress = overflow ? Math.min(1, Math.max(0, (NAV - rail.getBoundingClientRect().top) / overflow)) : 0;
        track.style.transform = `translate3d(${-progress * overflow}px, 0, 0)`;
        rail.style.setProperty("--progress", progress.toFixed(4));
        // a card is powered once the current has reached it
        const reached = progress * (cards.length - 1) + 0.35;
        cards.forEach((card, i) => card.toggleAttribute("data-on", i <= reached));
        return;
      }
      // stacked: the current runs down the list, level with a line three quarters down the screen
      const line = still.matches ? Infinity : window.innerHeight * 0.75;
      const box = frame.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (line - box.top) / box.height));
      rail.style.setProperty("--progress", progress.toFixed(4));
      cards.forEach((card) => card.toggleAttribute("data-on", card.getBoundingClientRect().top + 30 < line));
    };

    const measure = () => {
      rail.toggleAttribute("data-pinned", pinned.matches);
      if (pinned.matches) {
        overflow = Math.max(0, track.scrollWidth - frame.clientWidth);
        rail.style.height = `${pin.offsetHeight + overflow}px`;
      } else {
        rail.style.height = "";
        track.style.transform = "";
      }
      update();
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(pin);
    pinned.addEventListener("change", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    measure();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      pinned.removeEventListener("change", measure);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="rail" ref={railRef}>
      <div className="rail-pin" ref={pinRef}>
        <div className="wrap rail-head">{children}</div>
        <div className="rail-frame">
          <ol className="rail-track" ref={trackRef}>
            {steps.map((item, i) => (
              <li className="rail-card glass holo" key={item.step}>
                <span className="via" aria-hidden="true" />
                <span className="rail-index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{item.step}</h3>
                <p>{item.detail}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="wrap">
          <div className="rail-meter" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}
