import Link from "next/link";
import { achievements } from "@/content/site";

// Home page: recent achievements, one linked row each
export default function Achievements() {
  return (
    <section className="home-band section-paper">
      <div className="wrap">
        <h2 className="mono home-heading">Recent achievements</h2>
        <ul className="achievements">
          {achievements.map((item) => (
            <li key={item.title} className="reveal">
              <Link href={item.href} className="achievement">
                <span className="mono achievement-when">{item.when}</span>
                <span className="achievement-text">
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </span>
                <span className="achievement-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
