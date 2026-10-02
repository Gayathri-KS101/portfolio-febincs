import Panes from "@/components/Panes";
import Section from "@/components/Section";
import { workshop } from "@/content/site";

export default function Workshops() {
  return (
    <Section
      id="workshops"
      index="03"
      label="Workshops"
      lead
      title={
        <>
          Teaching it by <em>making</em> it.
        </>
      }
    >
      <p className="lede reveal">{workshop.intro}</p>
      <Panes events={workshop.events} />
    </Section>
  );
}
