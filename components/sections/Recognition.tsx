import Deck from "@/components/Deck";
import Section from "@/components/Section";
import { recognition } from "@/content/site";

export default function Recognition() {
  return (
    <Section id="recognition" index="04" label="Recognition" lead title="Awards, roles and certificates.">
      <Deck shots={recognition} label="Certificates" />
    </Section>
  );
}
