import Link from "next/link";
import Board from "@/components/Board";
import Stage from "@/components/Stage";
import { boardTiles, hero, profile } from "@/content/site";

// The home page's first screen: greeting, the live board and two buttons
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-screen">
        <div className="wrap hero-hello">
          <p className="mono hero-eyebrow">
            {profile.role} <span aria-hidden="true">/</span> {profile.focus}
          </p>
          <h1 className="hero-name">
            Hi, I&apos;m <em>{profile.name}</em>.
          </h1>
          <p className="hero-tagline">{profile.tagline}</p>
        </div>

        <Board tiles={boardTiles} chip={{ part: "FCS-01", name: profile.name, line: "Thrissur · Rev. 2026" }}>
          <Stage quad={hero.board} name={profile.name} caption={hero.caption} />
        </Board>

        <p className="mono board-hint" aria-hidden="true">
          ↔ Swipe the board to turn it
        </p>

        <div className="wrap hero-cta">
          <Link href="/contact" className="btn btn-arrow">
            Get in touch
          </Link>
          <Link href="/work" className="btn btn-ghost btn-arrow">
            See the work
          </Link>
        </div>
      </div>
    </section>
  );
}
