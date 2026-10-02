"use client";

import { useState } from "react";
import Viewer from "@/components/Viewer";
import type { Shot } from "@/content/site";

// Photo thumbnails that open in the full-size viewer
export default function Gallery({ shots, label }: { shots: Shot[]; label: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul className="shots" aria-label={label}>
        {shots.map((item, i) => (
          <li key={item.src}>
            <button
              type="button"
              className="shot"
              onClick={() => setOpen(i)}
              aria-label={`Open image: ${item.caption}`}
            >
              <span className="shot-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt="" width={item.width} height={item.height} loading="lazy" />
              </span>
              <span className="mono shot-caption">{item.caption}</span>
            </button>
          </li>
        ))}
      </ul>
      <Viewer shots={shots} index={open} onChange={setOpen} label={label} />
    </>
  );
}
