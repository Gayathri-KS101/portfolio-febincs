"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

type Tile = { ref: string; name: string; href: string; x: number; y: number };

type Props = {
  tiles: Tile[];
  chip: { part: string; name: string; line: string };
  children?: ReactNode; // the scope module, mounted on the board
};

// The hero's circuit board: a tilted plane with a chip at its centre. Traces fan
// out from the chip's pins, light up on load and then carry pulses of current.
// Glass tiles float above the plane; the pointer tilts the whole board slightly.

// Board space, in canvas units. The plane's CSS box has the same 100 : 64 shape.
const W = 1400;
const H = 896;
const CHIP = 210; // side of the chip, 15% of the width
const PINS = 11; // per side
const PITCH = 15; // between pins
const FPS = 30;
const BOOT = 1.9; // seconds for the traces to light up from the chip outwards

const COPPER = "#c8763a";
const COPPER_DIM = "rgba(200, 118, 58, 0.34)";
const HOT = "#ffc48a";
const GLOW = "#ff8f3f";

type Point = [number, number];
type Trace = {
  points: Point[];
  lengths: number[];
  total: number;
  speed: number;
  phase: number;
  inward: boolean;
  part?: { at: Point; flat: boolean; label: string }; // a resistor or capacitor soldered across the trace
};

// Small seeded generator, so the board is the same on every visit
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function buildTraces() {
  const random = seeded(7);
  const traces: Trace[] = [];
  const mid = (PINS - 1) / 2;

  for (let side = 0; side < 4; side++) {
    const extent = side % 2 === 0 ? W / 2 : H / 2; // centre to the edge this side faces
    // how far each pin's trace steps sideways; grows away from the middle pin so no two cross
    const rise = [0];
    for (let j = 1; j <= mid; j++) rise.push(rise[j - 1] + 20 + random() * 24);

    for (let i = 0; i < PINS; i++) {
      const j = Math.abs(i - mid);
      const direction = Math.sign(i - mid);
      const lateral = (i - mid) * PITCH;
      const straight = 28 + (mid - j) * 13;
      const turn = CHIP / 2 + straight;
      const end = Math.max(turn + rise[j] + 40, extent * (0.6 + random() * 0.4));
      const local: Point[] = [
        [CHIP / 2, lateral],
        [turn, lateral],
        [turn + rise[j], lateral + direction * rise[j]],
        [end, lateral + direction * rise[j]],
      ];
      // local (outwards, sideways) to board space, a quarter turn per side
      const points = local.map(([u, v]): Point => {
        if (side === 0) return [W / 2 + u, H / 2 + v];
        if (side === 1) return [W / 2 - v, H / 2 + u];
        if (side === 2) return [W / 2 - u, H / 2 - v];
        return [W / 2 + v, H / 2 - u];
      });
      const lengths = [0];
      for (let k = 1; k < points.length; k++) {
        lengths.push(lengths[k - 1] + Math.hypot(points[k][0] - points[k - 1][0], points[k][1] - points[k - 1][1]));
      }
      // every third trace or so carries a part on its last straight run
      const last = points.length - 1;
      const run = lengths[last] - lengths[last - 1];
      const part =
        run > 90 && random() < 0.38
          ? {
              at: [
                points[last - 1][0] + (points[last][0] - points[last - 1][0]) * 0.45,
                points[last - 1][1] + (points[last][1] - points[last - 1][1]) * 0.45,
              ] as Point,
              flat: side % 2 === 0,
              label: `${random() < 0.5 ? "R" : "C"}${traces.length + 1}`,
            }
          : undefined;
      traces.push({
        points,
        lengths,
        total: lengths[last],
        speed: 90 + random() * 130,
        phase: random() * 6,
        inward: random() < 0.3,
        part,
      });
    }
  }
  return traces;
}

// The point a given distance along a trace
function along(trace: Trace, distance: number): Point {
  const d = Math.min(Math.max(distance, 0), trace.total);
  let k = 1;
  while (k < trace.lengths.length - 1 && trace.lengths[k] < d) k++;
  const span = trace.lengths[k] - trace.lengths[k - 1] || 1;
  const f = (d - trace.lengths[k - 1]) / span;
  const [ax, ay] = trace.points[k - 1];
  const [bx, by] = trace.points[k];
  return [ax + (bx - ax) * f, ay + (by - ay) * f];
}

// Add the stretch of a trace between two distances to the current path
function stretch(ctx: CanvasRenderingContext2D, trace: Trace, from: number, to: number) {
  const start = along(trace, from);
  ctx.moveTo(start[0], start[1]);
  for (let k = 1; k < trace.points.length - 1; k++) {
    if (trace.lengths[k] > from && trace.lengths[k] < to) ctx.lineTo(trace.points[k][0], trace.points[k][1]);
  }
  const stop = along(trace, to);
  ctx.lineTo(stop[0], stop[1]);
}

export default function Board({ tiles, chip, children }: Props) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!scene || !canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const traces = buildTraces();
    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = W * scale;
    canvas.height = H * scale;

    let raf = 0;
    let visible = true;
    let lastDraw = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      const boot = reduceMotion ? 1 : Math.min(1, t / BOOT);
      const lit = 1 - (1 - boot) ** 2; // share of each trace drawn so far, easing out

      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // solder-mask dots
      ctx.fillStyle = "rgba(236, 231, 223, 0.08)";
      for (let y = 16; y < H; y += 32) {
        for (let x = 16; x < W; x += 32) ctx.fillRect(x, y, 1.5, 1.5);
      }

      // the traces themselves
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      for (const trace of traces) stretch(ctx, trace, 0, trace.total * lit);
      ctx.strokeStyle = COPPER_DIM;
      ctx.lineWidth = 3.2;
      ctx.stroke();

      // parts and their silkscreen names, once the traces reach them
      ctx.font = "500 11px ui-monospace, monospace";
      ctx.textAlign = "center";
      for (const trace of traces) {
        if (!trace.part || lit < 0.75) continue;
        const [x, y] = trace.part.at;
        const w = trace.part.flat ? 26 : 13;
        const h = trace.part.flat ? 13 : 26;
        ctx.fillStyle = "#b9bcc0"; // solder caps
        ctx.fillRect(x - w / 2, y - h / 2, w, h);
        ctx.fillStyle = "#17191b"; // body
        if (trace.part.flat) ctx.fillRect(x - w / 2 + 6, y - h / 2, w - 12, h);
        else ctx.fillRect(x - w / 2, y - h / 2 + 6, w, h - 12);
        ctx.fillStyle = "rgba(236, 231, 223, 0.42)";
        ctx.fillText(trace.part.label, x, y - h / 2 - 7);
      }

      // a via where each finished trace ends, glowing on its own slow rhythm
      if (boot === 1) {
        for (const trace of traces) {
          const [x, y] = trace.points[trace.points.length - 1];
          const glow = reduceMotion ? 0.6 : 0.5 + 0.5 * Math.sin(t * (0.6 + trace.phase * 0.25) + trace.phase * 3);
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = "#0b0c0d";
          ctx.fill();
          ctx.lineWidth = 2.4;
          ctx.strokeStyle = COPPER;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x, y, 2.2 + glow * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = HOT;
          ctx.shadowColor = GLOW;
          ctx.shadowBlur = 10 + glow * 22;
          ctx.globalAlpha = 0.35 + glow * 0.65;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      }

      // current: during boot a bright head on every trace, afterwards travelling pulses
      if (!reduceMotion) {
        ctx.beginPath();
        for (const trace of traces) {
          if (boot < 1) {
            stretch(ctx, trace, Math.max(0, trace.total * lit - 70), trace.total * lit);
            continue;
          }
          const cycle = trace.total + 520; // a pause between one pulse and the next
          const head = ((t * trace.speed + trace.phase * 300) % cycle) - 40;
          if (head < 0 || head > trace.total + 60) continue;
          const from = trace.inward ? trace.total - head : head - 60;
          const to = trace.inward ? trace.total - head + 60 : head;
          if (to <= 0 || from >= trace.total) continue;
          stretch(ctx, trace, Math.max(0, from), Math.min(trace.total, to));
        }
        ctx.strokeStyle = HOT;
        ctx.lineWidth = 3.2;
        ctx.shadowColor = GLOW;
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    };

    const frame = () => {
      raf = 0;
      const now = performance.now();
      if (now - lastDraw >= 1000 / FPS - 1) {
        draw(now);
        lastDraw = now;
      }
      schedule();
    };

    const schedule = () => {
      if (!raf && visible && !reduceMotion) raf = requestAnimationFrame(frame);
    };

    // the mouse leans the board a few degrees
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = scene.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      scene.style.setProperty("--lean-x", `${(-y * 5).toFixed(2)}deg`);
      scene.style.setProperty("--lean-z", `${(x * 6).toFixed(2)}deg`);
    };

    // A finger turns it: swipe sideways and the board spins about the chip, like a
    // turntable, so every tile can be brought round to the front. Let go and it glides
    // to a stop.
    const spinner = scene.querySelector<HTMLElement>(".board-spin");
    let spin = 0; // degrees
    let speed = 0; // degrees per frame, from the last movement
    let lastX: number | null = null;
    let glide = 0;
    const turn = (by: number) => {
      spin += by;
      spinner?.style.setProperty("--spin", `${spin.toFixed(2)}deg`);
    };
    const onTouchDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      cancelAnimationFrame(glide);
      lastX = event.clientX;
      speed = 0;
    };
    const onTouchMove = (event: PointerEvent) => {
      if (lastX === null || event.pointerType === "mouse") return;
      // dragging the near edge to the right turns the board anticlockwise, seen from above
      speed = (lastX - event.clientX) * 0.45;
      lastX = event.clientX;
      turn(speed);
    };
    const coast = () => {
      speed *= 0.9;
      if (Math.abs(speed) < 0.05) return;
      turn(speed);
      glide = requestAnimationFrame(coast);
    };
    const onRelease = (event: PointerEvent) => {
      if (lastX === null || event.pointerType === "mouse") return;
      lastX = null;
      if (!reduceMotion) glide = requestAnimationFrame(coast);
    };

    // only tick while the board is on screen
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    visibilityObserver.observe(scene);

    if (reduceMotion) draw(performance.now());
    else window.addEventListener("pointermove", onMove, { passive: true });
    scene.addEventListener("pointerdown", onTouchDown, { passive: true });
    scene.addEventListener("pointermove", onTouchMove, { passive: true });
    scene.addEventListener("pointerup", onRelease);
    scene.addEventListener("pointercancel", onRelease);
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(glide);
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.removeEventListener("pointerdown", onTouchDown);
      scene.removeEventListener("pointermove", onTouchMove);
      scene.removeEventListener("pointerup", onRelease);
      scene.removeEventListener("pointercancel", onRelease);
    };
  }, []);

  return (
    <div className="board-scene" ref={sceneRef}>
      <div className="board-plane">
        {/* this layer is what a sideways swipe turns */}
        <div className="board-spin">
          <canvas className="board-traces" ref={canvasRef} aria-hidden="true" />

          <div className="chip" aria-hidden="true">
            <span className="chip-pins chip-pins-x" />
            <span className="chip-pins chip-pins-y" />
            <span className="chip-body">
              <span className="chip-dot" />
              <span className="chip-part">{chip.part}</span>
              <span className="chip-name">{chip.name}</span>
              <span className="chip-line">{chip.line}</span>
            </span>
          </div>

          {tiles.map((tile) => (
            <Link className="tile" key={tile.ref} href={tile.href} style={{ left: `${tile.x}%`, top: `${tile.y}%` }}>
              <span className="tile-shadow" aria-hidden="true" />
              <span className="tile-glass">
                <span className="tile-ref">{tile.ref}</span>
                <span className="tile-name">{tile.name}</span>
              </span>
            </Link>
          ))}

          {children && (
            <div className="tile tile-scope">
              <span className="tile-shadow" aria-hidden="true" />
              <div className="tile-glass">{children}</div>
            </div>
          )}
        </div>
      </div>
      <span className="bokeh bokeh-1" aria-hidden="true" />
      <span className="bokeh bokeh-2" aria-hidden="true" />
      <span className="bokeh bokeh-3" aria-hidden="true" />
    </div>
  );
}
