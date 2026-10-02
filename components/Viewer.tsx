"use client";

import { useEffect, useRef } from "react";
import type { Shot } from "@/content/site";

type Props = {
  shots: Shot[];
  index: number | null; // the shot on show, or null when closed
  onChange: (index: number | null) => void;
  label: string; // names the set for screen readers
};

// Full-size viewer. Arrow keys and the buttons step through the set; Escape or a
// click on the backdrop closes it.
export default function Viewer({ shots, index, onChange, label }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  const step = (by: number) => index !== null && onChange((index + by + shots.length) % shots.length);
  const shot = index === null ? null : shots[index];

  return (
    <dialog
      ref={dialogRef}
      className="viewer"
      aria-label={label}
      onClose={() => onChange(null)}
      onClick={(event) => {
        if (event.target === event.currentTarget) onChange(null);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
    >
      {shot && (
        <figure className="viewer-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shot.src} alt={shot.title ?? shot.caption} width={shot.width} height={shot.height} />
          <figcaption>
            <span className="viewer-text">
              {shot.title && <strong>{shot.title}. </strong>}
              {shot.caption}
            </span>
            <span className="viewer-controls">
              {shots.length > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous image">
                    ←
                  </button>
                  <span className="mono" aria-hidden="true">
                    {(index ?? 0) + 1} / {shots.length}
                  </span>
                  <button type="button" onClick={() => step(1)} aria-label="Next image">
                    →
                  </button>
                </>
              )}
              <button type="button" onClick={() => onChange(null)} aria-label="Close" autoFocus>
                ✕
              </button>
            </span>
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}
