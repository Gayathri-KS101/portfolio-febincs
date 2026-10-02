"use client";

import { useEffect, useRef, useState } from "react";
import Chain from "@/components/Chain";
import Gallery from "@/components/Gallery";
import { useAutoplay } from "@/components/useAutoplay";
import Viewer from "@/components/Viewer";
import type { Project, Shot } from "@/content/site";

const DWELL = 3500; // ms on each project while the arc turns by itself

const code = (index: number) => `p${String(index + 1).padStart(2, "0")}`;

// The Work page. The projects' glass cards stand in an arc that curves away from you,
// and the chosen one turns to face you and steps forward; its full file opens underneath.
// The first project is open to begin with; a link to /work#p03 (as the hero's tiles use)
// opens that one instead.
// Left alone at the top of the page, the arc turns from project to project by itself.
// A click, a drag, a key, scrolling down to read, or arriving by a link to one project
// stops it for two minutes.
// On wide screens every card stands on the arc at once. On phones the arc is a wheel:
// the chosen card is in the middle and a swipe or a tap on a neighbour turns it.
type Props = {
  projects: Project[];
  // the last card: the smaller builds, kept together in one file
  others: { name: string; kind: string; summary: string; cover: string };
  builds: { name: string; meta: string; detail: string; image?: Shot }[];
};

export default function ProjectBrowser({ projects, others, builds }: Props) {
  const [chosen, setChosen] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const dragFrom = useRef<number | null>(null); // x where the current drag last turned the arc
  const dragged = useRef(false); // so the click that ends a drag is not taken for a tap

  const cards = [...projects, others]; // what stands on the arc, in order
  const count = cards.length;

  const { playing, touch } = useAutoplay(arcRef);

  useEffect(() => {
    if (!playing || zoom !== null) return;
    const timer = window.setTimeout(() => setChosen((card) => (card + 1) % count), DWELL);
    return () => window.clearTimeout(timer);
  }, [playing, zoom, chosen, count]);

  // scrolling down into a project's file means someone is reading it
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) touch();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [touch]);

  useEffect(() => {
    const fromHash = () => {
      const index = Number(/^#p(\d\d)$/.exec(window.location.hash)?.[1]) - 1;
      if (!(index >= 0 && index <= projects.length)) return; // no hash, or not a project
      touch();
      setChosen(index);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [projects, touch]);

  const choose = (index: number) => {
    const next = (index + count) % count;
    setChosen(next);
    setZoom(null);
    // keep the address in step, so the open project can be linked to
    window.history.replaceState(null, "", `#${code(next)}`);
    return next;
  };

  const project = chosen < projects.length ? projects[chosen] : null; // null: the "others" file is open
  const shots = project?.shots ?? [];
  const before = (chosen - 1 + count) % count;
  const after = (chosen + 1) % count;

  // from the foot of a file: open a neighbour and bring the arc back into view
  const turnTo = (index: number) => {
    choose(index);
    arcRef.current?.scrollIntoView({ block: "start" });
  };

  return (
    <div className="browser" onPointerDown={touch} onKeyDown={touch}>
      <div
        className="arc"
        ref={arcRef}
        role="tablist"
        aria-label="Projects"
        onKeyDown={(event) => {
          const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
          if (!step) return;
          const next = choose(chosen + step);
          event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
        }}
        onPointerDown={(event) => {
          dragFrom.current = event.clientX;
          dragged.current = false;
        }}
        onPointerMove={(event) => {
          if (dragFrom.current === null) return;
          const distance = event.clientX - dragFrom.current;
          if (Math.abs(distance) < 70) return;
          // every 70px of drag turns the arc by one card
          choose(chosen - Math.sign(distance));
          dragFrom.current = event.clientX;
          dragged.current = true;
        }}
        onPointerUp={() => (dragFrom.current = null)}
        onPointerLeave={() => (dragFrom.current = null)}
        onPointerCancel={() => (dragFrom.current = null)}
      >
        <span className="arc-floor" aria-hidden="true" />
        {cards.map((item, i) => {
          const half = Math.floor(count / 2);
          const spot = i - (count - 1) / 2; // fixed place on the arc, wide screens
          const turn = ((i - chosen + count + half) % count) - half; // place relative to the chosen card, phones
          const place = { "--spot": spot, "--turn": turn } as React.CSSProperties;
          return (
            <button
              type="button"
              role="tab"
              key={item.name}
              id={code(i)}
              className="file"
              style={place}
              aria-selected={i === chosen}
              aria-controls="project-panel"
              tabIndex={i === chosen ? 0 : -1}
              onClick={() => !dragged.current && choose(i)}
            >
              <span className="file-face glass holo tilt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="file-cover" src={item.cover} alt="" draggable={false} />
                <span className="hud" aria-hidden="true" />
                <span className="mono file-code">
                  P{String(i + 1).padStart(2, "0")}
                  <span className="file-state">{i === chosen ? "Open" : "View"}</span>
                </span>
                <span className="file-name">{item.name}</span>
                <span className="file-kind">{item.kind}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="panel glass" role="tabpanel" id="project-panel" aria-labelledby={code(chosen)}>
        <span className="hud" aria-hidden="true" />
        {/* keyed by the project, so the file fades in afresh, under one pass of a scan line */}
        <article className="panel-file" key={cards[chosen].name}>
          {project ? (
            <>
              <p className="mono panel-bar">
                <span className="panel-live" aria-hidden="true" />
                File {code(chosen).toUpperCase()} open
                <span className="panel-bar-meta">{project.meta}</span>
              </p>

              <header className="panel-head">
                <div>
                  <h2>{project.name}</h2>
                  <p className="panel-kind">{project.kind}</p>
                  <p className="project-summary">{project.summary}</p>
                </div>
                {shots[0] && (
                  <button
                    type="button"
                    className="panel-lead"
                    onClick={() => setZoom(0)}
                    aria-label={`Open image: ${shots[0].caption}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={shots[0].src} alt="" width={shots[0].width} height={shots[0].height} />
                    <span className="mono panel-lead-caption">{shots[0].caption}</span>
                  </button>
                )}
              </header>

              {project.chain && <Chain chain={project.chain} />}

              <div className="panel-body">
                <ul className="list">
                  {project.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div>
                  {project.specs && (
                    <dl className="specs">
                      {project.specs.map((spec) => (
                        <div key={spec.label}>
                          <dt className="mono">{spec.label}</dt>
                          <dd>{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <ul className="tags">
                    {project.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {project.links && (
                <ul className="links" aria-label="The eight links">
                  {project.links.map((link) => (
                    <li key={link.name} className={link.wireless ? "link link-air holo" : "link holo"}>
                      <span className="mono link-kind">{link.wireless ? "Wireless" : "Wired"}</span>
                      <strong>{link.name}</strong>
                      <span className="link-boards">{link.boards}</span>
                      <span className="link-note">{link.note}</span>
                    </li>
                  ))}
                </ul>
              )}

              {shots.length > 1 && (
                <ul className="panel-shots" aria-label={`${project.name} photos`}>
                  {shots.slice(1).map((shot, i) => (
                    <li key={shot.src}>
                      <button
                        type="button"
                        className="shot"
                        onClick={() => setZoom(i + 1)}
                        aria-label={`Open image: ${shot.caption}`}
                      >
                        <span className="shot-frame">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={shot.src} alt="" width={shot.width} height={shot.height} loading="lazy" />
                        </span>
                        <span className="mono shot-caption">{shot.caption}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              <p className="mono panel-bar">
                <span className="panel-live" aria-hidden="true" />
                File {code(chosen).toUpperCase()} open
                <span className="panel-bar-meta">{builds.length} entries</span>
              </p>
              <header className="panel-head panel-head-plain">
                <div>
                  <h2>{others.name}</h2>
                  <p className="panel-kind">{others.kind}</p>
                  <p className="project-summary">{others.summary}</p>
                </div>
              </header>
              <div className="cards cards-2 panel-builds">
                {builds.map((build) => (
                  <div className="card holo" key={build.name}>
                    <div>
                      <h3>{build.name}</h3>
                      <p className="card-org">{build.meta}</p>
                      <p>{build.detail}</p>
                    </div>
                    {build.image && <Gallery shots={[build.image]} label={build.name} />}
                  </div>
                ))}
              </div>
            </>
          )}

          <footer className="panel-foot">
            <button type="button" onClick={() => turnTo(before)}>
              <span className="mono">← Previous</span>
              {cards[before].name}
            </button>
            <button type="button" onClick={() => turnTo(after)}>
              <span className="mono">Next →</span>
              {cards[after].name}
            </button>
          </footer>
        </article>
      </div>

      <Viewer shots={shots} index={zoom} onChange={setZoom} label={`${cards[chosen].name} photos`} />
    </div>
  );
}
