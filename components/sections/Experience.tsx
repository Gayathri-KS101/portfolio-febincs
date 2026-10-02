import Section from "@/components/Section";
import { education, experience } from "@/content/site";

export default function Experience() {
  return (
    <Section id="experience" index="05" label="Experience" lead paper title="Where I've worked and taught.">
      <div className="timeline">
        {experience.map((job) => (
          <article className="job reveal" key={`${job.role}-${job.org}`}>
            <p className="mono job-period">{job.period}</p>
            <div>
              <h2>{job.role}</h2>
              {job.org && <p className="job-org">{job.org}</p>}
              <ul className="list">
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <h2 className="mono subhead">Education</h2>
      <div className="timeline">
        {education.map((item) => (
          <article className="job reveal" key={item.degree}>
            <p className="mono job-period">{item.period}</p>
            <div>
              <h3>{item.degree}</h3>
              <p className="job-org">{item.school}</p>
              <p className="edu-note">{item.note}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
