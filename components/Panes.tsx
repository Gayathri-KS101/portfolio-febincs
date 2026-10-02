"use client";

import { useEffect, useRef, useState } from "react";
import { useAutoplay } from "@/components/useAutoplay";
import Viewer from "@/components/Viewer";
import type { Shot } from "@/content/site";

type Event = { name: string; meta: string; detail: string; chips: string[]; shots: Shot[] };

const HOLD = 4500; // ms each photo stays up
const TASTE = 3; // photos shown per event before the next pane opens, while it runs by itself

// One pane of glass per event. The open pane is wide and plays through its photos, with a
// bar for each along the top; the others wait as slim frosted panes showing only their name.
// Left alone, the panes open and close in turn, a few photos each. Touch it and it is
// yours for two minutes: click a slim pane to open it, click the open pane's right or left
// part to step through its photos, and nothing moves until you do.
export default function Panes({ events }: { events: Event[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(0); // which pane
  const [slides, setSlides] = useState(() => events.map(() => 0)); // which photo, per pane
  const [zoom, setZoom] = useState<number | null>(null);
  const { playing, touch } = useAutoplay(rootRef);

  const step = (pane: number, by: number) => {
    const count = events[pane].shots.length;
    setSlides((all) => all.map((slide, i) => (i === pane ? (slide + by + count) % count : slide)));
  };

  const running = playing && zoom === null;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      const last = Math.min(TASTE, events[open].shots.length) - 1;
      // a few photos of this event, then on to the next pane
      if (slides[open] >= last) {
        const following = (open + 1) % events.length;
        setSlides((all) => all.map((slide, i) => (i === following ? 0 : slide)));
        setOpen(following);
      } else step(open, 1);
    }, HOLD);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, open, slides]);

  const event = events[open];

  return (
    <div className="panes-wrap" onPointerDown={touch} onKeyDown={touch}>
      <div className="panes" ref={rootRef} data-running={running || undefined}>
        {events.map((item, pane) => {
          const isOpen = pane === open;
          const current = slides[pane];
          const shot = item.shots[current];
          return (
            <article className="pane glass holo" key={item.name} data-open={isOpen || undefined}>
              <div className="pane-photos" aria-hidden="true">
                {item.shots.map((photo, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={photo.src} src={photo.src} alt="" loading="lazy" data-show={i === current || undefined} />
                ))}
              </div>
              <span className="pane-gloss" aria-hidden="true" />

              {isOpen ? (
                <>
                  <div className="pane-bars" aria-hidden="true">
                    {item.shots.map((photo, i) => (
                      <span key={photo.src} data-state={i < current ? "done" : i === current ? "now" : "todo"}>
                        {/* keyed by the photo, so the fill restarts whenever it changes */}
                        {i === current && <i key={`${pane}-${current}`} style={{ animationDuration: `${HOLD}ms` }} />}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="pane-tap pane-tap-back"
                    onClick={() => step(pane, -1)}
                    aria-label={`${item.name}: previous photo`}
                  />
                  <button
                    type="button"
                    className="pane-tap pane-tap-next"
                    onClick={() => step(pane, 1)}
                    aria-label={`${item.name}: next photo`}
                  />
                  <div className="pane-strip">
                    <div>
                      <p className="mono pane-meta">{item.meta}</p>
                      <h2>{item.name}</h2>
                      <p className="pane-caption" aria-live="polite">
                        {shot.caption}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="pane-zoom"
                      onClick={() => setZoom(current)}
                      aria-label={`Open full size: ${shot.caption}`}
                    >
                      ⤢
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="pane-spine"
                  onClick={() => setOpen(pane)}
                  aria-label={`Open ${item.name}`}
                >
                  <span className="mono pane-number">{String(pane + 1).padStart(2, "0")}</span>
                  <span className="pane-name">{item.name}</span>
                  <span className="mono pane-count">{item.shots.length} photos</span>
                </button>
              )}
            </article>
          );
        })}
      </div>

      {/* keyed by the event, so the notes fade over as the panes change */}
      <div className="pane-notes" key={event.name}>
        <ul className="tags tags-large">
          {event.chips.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>
        <p>{event.detail}</p>
      </div>

      <Viewer
        shots={event.shots}
        index={zoom}
        onChange={(index) => {
          setZoom(index);
          if (index !== null) setSlides((all) => all.map((slide, i) => (i === open ? index : slide)));
        }}
        label={`${event.name} photos`}
      />
    </div>
  );
}
