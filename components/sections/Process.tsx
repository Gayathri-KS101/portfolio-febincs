import Rail from "@/components/Rail";
import Traces from "@/components/Traces";
import { process } from "@/content/site";

export default function Process() {
  return (
    <section id="process" className="section-dark rail-section">
      <Traces />
      <Rail steps={process}>
        <p className="mono rail-label">
          <span>01.3</span> Process
        </p>
        <h2 className="section-title">
          From schematic to <em>working</em> firmware.
        </h2>
      </Rail>
    </section>
  );
}
