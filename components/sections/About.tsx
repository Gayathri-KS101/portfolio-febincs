import Section from "@/components/Section";
import { profile } from "@/content/site";

export default function About() {
  return (
    <Section
      id="about"
      index="01"
      label="About"
      lead
      title={
        <>
          An engineer who builds the board <em>and</em> the code that runs on it.
        </>
      }
    >
      <div className="about">
        <div className="about-text reveal">
          {profile.about.map((paragraph) => (
            <p key={paragraph.text} data-label={paragraph.label}>
              {paragraph.text}
            </p>
          ))}
          <dl className="facts">
            {profile.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="mono">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="portrait reveal">
          <div className="portrait-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.portrait.src}
              alt={`${profile.name} speaking at IEDC Summit 2026`}
              width={profile.portrait.width}
              height={profile.portrait.height}
            />
          </div>
          <figcaption className="mono">{profile.portrait.caption}</figcaption>
        </figure>
      </div>
    </Section>
  );
}
