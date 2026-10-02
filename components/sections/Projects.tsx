import ProjectBrowser from "@/components/ProjectBrowser";
import { builds, otherWorks, projects } from "@/content/site";

export default function Projects() {
  return (
    <section id="work" className="section section-lead work">
      <div className="wrap">
        <header className="work-head">
          <p className="mono work-label">
            <span>02</span> Work
          </p>
          <h1 className="section-title">Selected projects.</h1>
        </header>
        <ProjectBrowser projects={projects} others={otherWorks} builds={builds} />
      </div>
    </section>
  );
}
