"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

const QUIET = 120_000; // ms a piece stays still after the visitor touches it: time to read

// For the pieces that run by themselves (the pin diagram, the workshop panes, the
// certificate deck). `playing` is true while the piece is on screen and nobody has
// touched it lately; call `touch` whenever the visitor takes over and it rests for two
// minutes before carrying on. It never plays for visitors who ask for reduced motion.
export function useAutoplay(ref: RefObject<HTMLElement | null>) {
  const [resting, setResting] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [still, setStill] = useState(true);
  const timer = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer.current);
    };
  }, [ref]);

  const touch = useCallback(() => {
    setResting(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setResting(false), QUIET);
  }, []);

  return { playing: onScreen && !resting && !still, touch };
}
