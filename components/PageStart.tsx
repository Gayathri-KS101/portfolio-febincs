"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useTransit } from "@/components/Transit";
import { pages } from "@/content/site";

const tour = [{ href: "/", label: "Home" }, ...pages]; // the order the pages are read in

const WHEEL = 420; // how much upward wheel travel, at the top of a page, goes back a page
const PULL = 150; // how many px of pulling down on a touch screen does
const REST = 400; // ms the page must have sat still at its top before either counts

// The way back. At the very top of any page but the first, keep scrolling up (or pull
// down on a touch screen) and a tab under the nav charges; when it is full, the
// previous page loads, at its end. The mirror of PageEnd.
export default function PageStart() {
  const pathname = usePathname();
  const go = useTransit();
  const tabRef = useRef<HTMLDivElement>(null);

  const here = tour.findIndex((page) => page.href === (pathname.replace(/\/$/, "") || "/"));
  const previous = here > 0 ? tour[here - 1] : undefined;

  useEffect(() => {
    const tab = tabRef.current;
    if (!tab || !previous) return;

    let travelled = 0; // wheel travel gathered so far
    let lastMoved = performance.now(); // when the page last actually scrolled
    let touchFrom: number | null = null;
    let relax = 0;
    let fired = false;

    const show = (charge: number) => {
      tab.style.setProperty("--charge", Math.min(1, charge).toFixed(3));
      tab.toggleAttribute("data-pulling", charge > 0.02);
    };
    const atTop = () => window.scrollY <= 0;
    // a flick that carries the page to its top must not carry on into the previous page
    const rested = () => performance.now() - lastMoved > REST;
    const fire = () => {
      if (fired) return;
      fired = true;
      go(previous.href, previous.label, true);
    };

    const onScroll = () => {
      lastMoved = performance.now();
    };
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY >= 0 || !atTop() || !rested()) {
        if (event.deltaY > 0) {
          travelled = 0;
          show(0);
        }
        return;
      }
      travelled += -event.deltaY;
      show(travelled / WHEEL);
      window.clearTimeout(relax);
      if (travelled >= WHEEL) fire();
      // let go and it drains
      else
        relax = window.setTimeout(() => {
          travelled = 0;
          show(0);
        }, 500);
    };
    const onTouchStart = (event: TouchEvent) => {
      touchFrom = atTop() && rested() ? event.touches[0].clientY : null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touchFrom === null) return;
      const pulled = event.touches[0].clientY - touchFrom;
      if (!atTop() || pulled < 0) {
        touchFrom = null;
        show(0);
        return;
      }
      show(pulled / PULL);
      if (pulled >= PULL) fire();
    };
    const onTouchEnd = () => {
      touchFrom = null;
      if (!fired) show(0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.clearTimeout(relax);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      show(0);
    };
  }, [previous, go]);

  if (!previous) return null;

  return (
    <div className="back-tab" ref={tabRef} aria-hidden="true">
      <span className="mono back-tab-label">↑ Previous</span>
      <strong>{previous.label}</strong>
      <span className="back-tab-meter">
        <span />
      </span>
    </div>
  );
}
