"use client";

import { useEffect, useRef, useState } from "react";
import { useAutoplay } from "@/components/useAutoplay";
import Viewer from "@/components/Viewer";
import type { Shot } from "@/content/site";

const REACH = 2; // cards shown either side of the one in front
const DWELL = 5000; // ms on each card while it turns by itself

// A fanned deck: one card faces you, the rest angle away to either side. Click a side
// card, drag, or use the arrows to bring another to the front; click the front card
// to open it full size. The deck is a loop, so it fans both ways from any card.
// Left alone it turns by itself; once touched it holds still for two minutes.
export default function Deck({ shots, label }: { shots: Shot[]; label: string }) {
  const [front, setFront] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const dragFrom = useRef<number | null>(null); // x where the current drag last turned the deck
  const dragged = useRef(false); // so the click that ends a drag is not taken for a tap

  const deckRef = useRef<HTMLDivElement>(null);
  const { playing, touch } = useAutoplay(deckRef);

  const count = shots.length;
  const go = (index: number) => setFront(((index % count) + count) % count);
  const shot = shots[front];

  useEffect(() => {
    if (!playing || zoom !== null) return;
    const timer = window.setTimeout(() => setFront((card) => (card + 1) % count), DWELL);
    return () => window.clearTimeout(timer);
  }, [playing, zoom, front, count]);

  return (
    <div className="deck" ref={deckRef} onPointerDown={touch} onKeyDown={touch}>
      <div
        className="deck-stage"
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") go(front + 1);
          if (event.key === "ArrowLeft") go(front - 1);
        }}
        onPointerDown={(event) => {
          dragFrom.current = event.clientX;
          dragged.current = false;
        }}
        onPointerMove={(event) => {
          if (dragFrom.current === null) return;
          const distance = event.clientX - dragFrom.current;
          if (Math.abs(distance) < 70) return;
          // every 70px of drag turns the deck by one card
          go(front - Math.sign(distance));
          dragFrom.current = event.clientX;
          dragged.current = true;
        }}
        onPointerUp={() => (dragFrom.current = null)}
        onPointerLeave={() => (dragFrom.current = null)}
        onPointerCancel={() => (dragFrom.current = null)}
      >
        {shots.map((item, i) => {
          // shortest way round the loop from the front card to this one
          const half = Math.floor(count / 2);
          const offset = ((i - front + count + half) % count) - half;
          const hidden = Math.abs(offset) > REACH;
          return (
            <button
              type="button"
              className="deck-card glass"
              key={item.src}
              style={{ "--offset": offset, "--away": Math.abs(offset) } as React.CSSProperties}
              data-front={offset === 0 || undefined}
              data-hidden={hidden || undefined}
              tabIndex={offset === 0 ? 0 : -1}
              aria-hidden={offset !== 0}
              aria-label={offset === 0 ? `Open full size: ${item.title}` : undefined}
              onClick={() => {
                if (dragged.current) return;
                if (offset === 0) setZoom(i);
                else go(i);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt="" width={item.width} height={item.height} loading="lazy" draggable={false} />
            </button>
          );
        })}
      </div>

      <div className="deck-caption" aria-live="polite">
        <p className="mono deck-tag">
          {shot.tag} <span aria-hidden="true">·</span> {front + 1} / {shots.length}
        </p>
        <h3>{shot.title}</h3>
        <p className="deck-where">{shot.caption}</p>
        {/* keyed by the certificate, so the story fades in afresh as the deck turns */}
        {shot.story && (
          <blockquote className="deck-story" key={shot.src}>
            {shot.story}
          </blockquote>
        )}
      </div>

      <div className="deck-controls">
        <button type="button" onClick={() => go(front - 1)} aria-label="Previous certificate">
          ←
        </button>
        <span className="deck-dots" aria-hidden="true">
          {shots.map((item, i) => (
            <i key={item.src} data-on={i === front || undefined} />
          ))}
        </span>
        <button type="button" onClick={() => go(front + 1)} aria-label="Next certificate">
          →
        </button>
      </div>

      <Viewer shots={shots} index={zoom} onChange={setZoom} label={label} />
    </div>
  );
}
