"use client";

import { useEffect, useRef, useState } from "react";
import Typed from "@/components/Typed";
import { useAutoplay } from "@/components/useAutoplay";
import { sides } from "@/content/site";

const DWELL = 5000; // ms on each pin while it runs by itself: time to type the line and read it

// Home page: who he is, as the pin diagram from a datasheet. Each side of him is a pin and
// the chip's face types out what it does. Left alone it steps from pin to pin. Pointing at
// a pin shows it, and the stepping carries on from there; clicking or tapping one holds it
// for two minutes. Flat line work on purpose, so it sits quietly under the hero's board.
export default function Sides() {
  const figureRef = useRef<HTMLElement>(null);
  const [chosen, setChosen] = useState(0);
  const { playing, touch } = useAutoplay(figureRef);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setChosen((pin) => (pin + 1) % sides.length), DWELL);
    return () => window.clearTimeout(timer);
  }, [playing, chosen]);

  const pick = (index: number) => {
    touch();
    setChosen(index);
  };
  const half = Math.ceil(sides.length / 2);
  const side = sides[chosen];

  const pin = (index: number) => (
    <button
      type="button"
      className="pin"
      key={sides[index].pin}
      aria-pressed={index === chosen}
      onClick={() => pick(index)}
      // only a look, not a hold: a pointer that happens to rest on a pin must not stop it
      onPointerEnter={(event) => event.pointerType === "mouse" && setChosen(index)}
      onFocus={(event) => event.target.matches(":focus-visible") && pick(index)}
    >
      <span className="pin-name">{sides[index].name}</span>
      <span className="pin-lead" aria-hidden="true" />
      <span className="mono pin-number" aria-hidden="true">
        {index + 1}
      </span>
    </button>
  );

  return (
    <section className="home-band home-band-last">
      <div className="wrap">
        <h2 className="mono home-heading">A few sides of me</h2>
        <figure className="pinout reveal" ref={figureRef}>
          <div className="pinout-side">{sides.slice(0, half).map((_, i) => pin(i))}</div>

          <div className="pinout-chip">
            <span className="pinout-notch" aria-hidden="true" />
            {/* keyed by the pin, so the text fades in afresh on every change */}
            <div className="pinout-face" key={side.pin}>
              <p className="mono pinout-label">
                Pin {chosen + 1} <span aria-hidden="true">/</span> {side.pin}
              </p>
              <p className="pinout-name">{side.name}</p>
              <p className="pinout-detail">
                <Typed text={side.detail} />
              </p>
            </div>
            <span className="mono pinout-part" aria-hidden="true">
              FCS-01
            </span>
          </div>

          <div className="pinout-side pinout-side-right">{sides.slice(half).map((_, i) => pin(half + i))}</div>

          <figcaption className="mono pinout-caption">Fig. 2 / Pin configuration. Pick a pin.</figcaption>
        </figure>
      </div>
    </section>
  );
}
