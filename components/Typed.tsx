"use client";

import { useEffect, useState } from "react";

const PACE = 18; // ms per character

// Text that types itself out, with a caret. Give it a new `key` to have it start again.
// Screen readers get the whole text at once; visitors who ask for reduced motion see it whole.
export default function Typed({ text }: { text: string }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    // with reduced motion the first tick puts the whole text up at once
    const stride = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? text.length : 1;
    const timer = window.setInterval(() => {
      setShown((count) => {
        if (count >= text.length) window.clearInterval(timer);
        return Math.min(text.length, count + stride);
      });
    }, PACE);
    return () => window.clearInterval(timer);
  }, [text]);

  return (
    <>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true" className="typed" data-done={shown >= text.length || undefined}>
        {text.slice(0, shown)}
      </span>
    </>
  );
}
