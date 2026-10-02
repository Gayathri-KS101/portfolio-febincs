"use client";

import { useEffect, useRef } from "react";

type Point = [number, number];

type Props = {
  quad: Point[]; // board corners as fractions of the frame: TL, TR, BR, BL
  name: string; // spelled out in pixels along the foot of the board
  caption: string;
};

// Black and white: bright lines for the signal itself, grey for everything secondary
const SLIDE = "#0d0d0c";
const TRACE = "#f5f2ea";
const SECONDARY = "#9a9891";
const LABEL = "rgba(245,242,234,0.7)";
const GRID = "rgba(245,242,234,0.07)";

const CARRIER_CYCLES = 22; // carrier periods across the plot
const DEFAULT_DEPTH = 0.6; // modulation index m
const DEFAULT_MESSAGE = 2; // message periods across the plot, shown as kHz
const TAU = Math.PI * 2;

// 5 x 7 pixel font, one string per letter, rows top to bottom
const GLYPH_ROWS = 7;
const GLYPH_COLS = 5;
const SPACE_COLS = 3;
const GLYPHS: Record<string, string> = {
  A: "01110 10001 10001 11111 10001 10001 10001",
  B: "11110 10001 10001 11110 10001 10001 11110",
  C: "01110 10001 10000 10000 10000 10001 01110",
  D: "11110 10001 10001 10001 10001 10001 11110",
  E: "11111 10000 10000 11110 10000 10000 11111",
  F: "11111 10000 10000 11110 10000 10000 10000",
  G: "01110 10001 10000 10111 10001 10001 01111",
  H: "10001 10001 10001 11111 10001 10001 10001",
  I: "11111 00100 00100 00100 00100 00100 11111",
  J: "00111 00010 00010 00010 00010 10010 01100",
  K: "10001 10010 10100 11000 10100 10010 10001",
  L: "10000 10000 10000 10000 10000 10000 11111",
  M: "10001 11011 10101 10101 10001 10001 10001",
  N: "10001 11001 10101 10011 10001 10001 10001",
  O: "01110 10001 10001 10001 10001 10001 01110",
  P: "11110 10001 10001 11110 10000 10000 10000",
  Q: "01110 10001 10001 10001 10101 10010 01101",
  R: "11110 10001 10001 11110 10100 10010 10001",
  S: "01111 10000 10000 01110 00001 00001 11110",
  T: "11111 00100 00100 00100 00100 00100 00100",
  U: "10001 10001 10001 10001 10001 10001 01110",
  V: "10001 10001 10001 10001 10001 01010 00100",
  W: "10001 10001 10001 10101 10101 11011 10001",
  X: "10001 10001 01010 00100 01010 10001 10001",
  Y: "10001 10001 01010 00100 00100 00100 00100",
  Z: "11111 00001 00010 00100 01000 10000 11111",
};

// Lay a name out as columns of lit rows: one array of GLYPH_ROWS booleans per column
function pixelColumns(name: string) {
  const columns: boolean[][] = [];
  const blank = () => Array<boolean>(GLYPH_ROWS).fill(false);
  for (const char of name.toUpperCase()) {
    const rows = GLYPHS[char]?.split(" ");
    if (!rows) {
      for (let i = 0; i < SPACE_COLS; i++) columns.push(blank());
      continue;
    }
    for (let col = 0; col < GLYPH_COLS; col++) columns.push(rows.map((row) => row[col] === "1"));
    columns.push(blank()); // gap between letters
  }
  columns.pop();
  return columns;
}

// CSS matrix3d that maps a w x h box at the origin onto four corner points
function quadTransform(w: number, h: number, corners: Point[]) {
  const source: Point[] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  // Solve the 8 homography unknowns by Gaussian elimination
  const rows: number[][] = [];
  source.forEach(([x, y], i) => {
    const [u, v] = corners[i];
    rows.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    rows.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  });
  for (let col = 0; col < 8; col++) {
    let pivot = col;
    for (let row = col + 1; row < 8; row++) {
      if (Math.abs(rows[row][col]) > Math.abs(rows[pivot][col])) pivot = row;
    }
    [rows[col], rows[pivot]] = [rows[pivot], rows[col]];
    for (let row = 0; row < 8; row++) {
      if (row === col) continue;
      const factor = rows[row][col] / rows[col][col];
      for (let k = col; k < 9; k++) rows[row][k] -= factor * rows[col][k];
    }
  }
  const [a, b, c, d, e, f, g, i] = rows.map((row, n) => row[8] / row[n]);
  return `matrix3d(${a},${d},0,${g}, ${b},${e},0,${i}, 0,0,1,0, ${c},${f},0,1)`;
}

export default function Stage({ quad, name, caption }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!frame || !canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fontFamily = getComputedStyle(canvas).fontFamily;
    const nameColumns = pixelColumns(name);

    let width = 0; // slide size in CSS px, before the perspective transform
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let disposed = false;
    const start = performance.now();

    // Pointer position steers the modulation; values ease towards their targets
    const signal = { depth: DEFAULT_DEPTH, message: DEFAULT_MESSAGE };
    const target = { depth: DEFAULT_DEPTH, message: DEFAULT_MESSAGE };

    const layout = () => {
      // layout size, not the on-screen box: the frame may sit on a tilted plane
      const bounds = { width: frame.clientWidth, height: frame.clientHeight };
      if (!bounds.width || !bounds.height) return;
      const corners = quad.map(([x, y]) => [x * bounds.width, y * bounds.height] as Point);
      const [tl, tr, br, bl] = corners;
      width = Math.round((Math.hypot(tr[0] - tl[0], tr[1] - tl[1]) + Math.hypot(br[0] - bl[0], br[1] - bl[1])) / 2);
      height = Math.round((Math.hypot(bl[0] - tl[0], bl[1] - tl[1]) + Math.hypot(br[0] - tr[0], br[1] - tr[1])) / 2);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.style.transform = quadTransform(width, height, corners);
      const pixelWidth = Math.round(width * dpr);
      const pixelHeight = Math.round(height * dpr);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
    };

    const text = (label: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = "left") => {
      ctx.font = `500 ${size}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(label, x, y);
    };

    const glowLine = (color: string, lineWidth: number, blur: number) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const draw = (now: number) => {
      raf = 0;
      if (disposed || !width || !height) return;
      const t = reduceMotion ? 0 : Math.max(0, (now - start) / 1000);

      signal.depth += (target.depth - signal.depth) * 0.08;
      signal.message += (target.message - signal.message) * 0.08;
      const { depth, message } = signal;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = SLIDE;
      ctx.fillRect(0, 0, width, height);

      // grid
      const cell = width / 14;
      ctx.strokeStyle = GRID;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = cell; x < width; x += cell) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, height);
      }
      for (let y = cell; y < height; y += cell) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(width, Math.round(y) + 0.5);
      }
      ctx.stroke();

      const left = width * 0.07;
      const right = width * 0.93;
      const span = right - left;
      const small = Math.max(8, width * 0.03);
      const phase = t * 0.22;
      const envelope = (x: number) => Math.cos(TAU * (message * x - phase));

      text("FIG. 1 / AMPLITUDE MODULATION", left, height * 0.075, small, LABEL);

      // message signal m(t)
      const messageY = height * 0.2;
      const messageAmp = height * 0.045;
      text("m(t)", left, messageY - messageAmp - small * 0.9, small, SECONDARY);
      ctx.beginPath();
      for (let px = 0; px <= span; px++) {
        const y = messageY - envelope(px / span) * messageAmp * depth;
        if (px === 0) ctx.moveTo(left + px, y);
        else ctx.lineTo(left + px, y);
      }
      glowLine(SECONDARY, 1.4, 6);

      // modulated carrier s(t) with its envelope
      const carrierY = height * 0.43;
      const carrierAmp = height * 0.085;
      text("s(t)", left, carrierY - carrierAmp * 2 - small * 0.9, small, TRACE);
      ctx.setLineDash([4, 5]);
      for (const side of [1, -1]) {
        ctx.beginPath();
        for (let px = 0; px <= span; px += 2) {
          const y = carrierY - side * (1 + depth * envelope(px / span)) * carrierAmp;
          if (px === 0) ctx.moveTo(left + px, y);
          else ctx.lineTo(left + px, y);
        }
        ctx.strokeStyle = "rgba(245,242,234,0.38)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.beginPath();
      for (let px = 0; px <= span; px += 0.5) {
        const x = px / span;
        const y = carrierY - (1 + depth * envelope(x)) * Math.cos(TAU * (CARRIER_CYCLES * x - t * 1.1)) * carrierAmp;
        if (px === 0) ctx.moveTo(left + px, y);
        else ctx.lineTo(left + px, y);
      }
      glowLine(TRACE, 1.4, 7);

      // live values on the left, spectrum (carrier with a sideband either side) on the right
      const rowTop = height * 0.6;
      const rowBase = height * 0.76;
      const values = [`m  = ${depth.toFixed(2)}`, `fm = ${message.toFixed(1)} kHz`, `fc = ${CARRIER_CYCLES} kHz`];
      values.forEach((value, i) => text(value, left, rowTop + small * (1 + i * 1.9), small * 1.15, SECONDARY));

      const specLeft = width * 0.52;
      const specHeight = rowBase - rowTop - small * 1.4;
      const specMid = (specLeft + right) / 2;
      const spread = ((right - specLeft) / 2) * (0.18 + 0.2 * message) * 0.8;
      text("SPECTRUM", specLeft, rowTop + small * 0.4, small, LABEL);
      ctx.beginPath();
      ctx.moveTo(specLeft, rowBase + 0.5);
      ctx.lineTo(right, rowBase + 0.5);
      ctx.strokeStyle = "rgba(245,242,234,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(specMid, rowBase);
      ctx.lineTo(specMid, rowBase - specHeight);
      glowLine(TRACE, 2, 7);
      ctx.beginPath();
      for (const side of [1, -1]) {
        ctx.moveTo(specMid + side * spread, rowBase);
        ctx.lineTo(specMid + side * spread, rowBase - (specHeight * depth) / 2);
      }
      glowLine(SECONDARY, 2, 6);

      // the name as an LED matrix; each column's brightness rides the same envelope as the carrier
      const pixel = Math.min(span / nameColumns.length, (height * 0.12) / GLYPH_ROWS);
      const dot = pixel * 0.78;
      const nameTop = height * 0.955 - pixel * GLYPH_ROWS;
      nameColumns.forEach((column, col) => {
        const level = (1 + depth * envelope(col / nameColumns.length)) / (1 + depth);
        column.forEach((lit, row) => {
          ctx.globalAlpha = lit ? 0.58 + 0.42 * level : 0.08;
          ctx.fillStyle = TRACE;
          ctx.fillRect(left + col * pixel, nameTop + row * pixel, dot, dot);
        });
      });
      ctx.globalAlpha = 1;

      const settling = Math.abs(target.depth - depth) + Math.abs(target.message - message) > 0.002;
      if (!reduceMotion || settling) schedule();
    };

    const schedule = () => {
      if (!raf && visible && !disposed) raf = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      // offsetX/Y are in the frame's own space, so they survive a 3D transform
      const x = Math.min(1, Math.max(0, event.offsetX / frame.clientWidth));
      const y = Math.min(1, Math.max(0, event.offsetY / frame.clientHeight));
      target.message = 1 + x * 2.6; // left to right: slower to faster message
      target.depth = 1 - y * 0.8; // bottom to top: shallower to deeper modulation
      schedule();
    };
    const onPointerLeave = () => {
      target.depth = DEFAULT_DEPTH;
      target.message = DEFAULT_MESSAGE;
      schedule();
    };

    frame.addEventListener("pointermove", onPointerMove);
    frame.addEventListener("pointerleave", onPointerLeave);

    const resizeObserver = new ResizeObserver(() => {
      layout();
      schedule();
    });
    resizeObserver.observe(frame);

    // don't animate while scrolled out of view
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    visibilityObserver.observe(frame);

    layout();
    schedule();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      frame.removeEventListener("pointermove", onPointerMove);
      frame.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [quad, name]);

  return (
    <figure className="stage">
      <div className="stage-mat">
        <div className="stage-frame" ref={frameRef}>
          <canvas ref={canvasRef} className="stage-slide" aria-hidden="true" />
        </div>
      </div>
      <figcaption className="mono stage-caption">
        <span>{caption}</span>
        <span className="stage-hint">Move the cursor to modulate</span>
      </figcaption>
    </figure>
  );
}
