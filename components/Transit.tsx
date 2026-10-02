"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

// `atFoot` lands the visitor at the end of the page's content rather than its top:
// the natural place to arrive when going backwards
type Go = (href: string, label: string, atFoot?: boolean) => void;

const TransitContext = createContext<Go>(() => {});

// Lets any component send the visitor to another page through the transition
export const useTransit = () => useContext(TransitContext);

const CLOSE = 750; // ms the screen takes to cover, before the next page is asked for
const OPEN = 650; // ms it takes to clear once the next page is in

// The page-to-page transition. A screen closes over the page: buses of current run in
// from both sides to the pins of a chip that names the page being loaded. The next page
// is swapped in behind it, then the screen clears.
export default function Transit({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");
  const [label, setLabel] = useState("");
  const leaving = useRef<string | null>(null); // the page the transition started on
  const landAtFoot = useRef(false);

  const go = useCallback<Go>(
    (href, name, atFoot = false) => {
      if (leaving.current !== null) return; // already on its way
      landAtFoot.current = atFoot;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        leaving.current = pathname;
        router.push(href);
        return;
      }
      leaving.current = pathname;
      setLabel(name);
      setPhase("in");
      router.prefetch(href);
      window.setTimeout(() => router.push(href), CLOSE);
    },
    [pathname, router],
  );

  // the next page has arrived behind the screen: put the visitor in the right place, then clear it
  useEffect(() => {
    if (leaving.current === null || leaving.current === pathname) return;
    const toFoot = () => {
      // the end of the content: just above the "up next" band, if the page has one
      const band = document.querySelector<HTMLElement>(".next");
      const foot = band ? band.offsetTop : document.documentElement.scrollHeight;
      window.scrollTo({ top: foot - window.innerHeight, behavior: "instant" });
    };
    const settle: number[] = [];
    if (landAtFoot.current) {
      toFoot();
      // again once the page has laid itself out (the Process rail sets its own height)
      settle.push(window.setTimeout(toFoot, 120), window.setTimeout(toFoot, 320));
    }
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase(still ? "idle" : "out");
    const timer = window.setTimeout(
      () => {
        leaving.current = null;
        landAtFoot.current = false;
        setPhase("idle");
      },
      still ? 400 : OPEN,
    );
    return () => {
      window.clearTimeout(timer);
      settle.forEach((id) => window.clearTimeout(id));
    };
  }, [pathname]);

  return (
    <TransitContext.Provider value={go}>
      {children}
      <div className="transit" data-phase={phase} aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span
            className="transit-bus"
            key={i}
            style={{ "--i": i, "--row": Math.floor(i / 2) } as React.CSSProperties}
          />
        ))}
        <div className="transit-chip">
          <span className="mono transit-part">FCS-01</span>
          <strong>{label}</strong>
          <span className="mono transit-status">Loading</span>
        </div>
      </div>
    </TransitContext.Provider>
  );
}
