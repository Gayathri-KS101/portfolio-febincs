import Section from "@/components/Section";
import { capabilities } from "@/content/site";

export default function Capabilities() {
  return (
    <Section id="capabilities" index="01.2" label="Capabilities" title="What I work with." paper>
      <div className="spec reveal">
        {capabilities.map((group) => (
          <div className="spec-row" key={group.ref}>
            <span className="mono spec-ref">{group.ref}</span>
            <h3 className="spec-label">{group.label}</h3>
            <ul className="spec-items">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
