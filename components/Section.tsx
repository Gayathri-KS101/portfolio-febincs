import type { ReactNode } from "react";

type Props = {
  id: string;
  index: string;
  label: string;
  title: ReactNode;
  children: ReactNode;
  lead?: boolean; // the first section of a page: its title is the page's main heading
  paper?: boolean; // while this section holds mid-screen, the whole screen is cream
};

export default function Section({ id, index, label, title, children, lead, paper }: Props) {
  const Heading = lead ? "h1" : "h2";
  const classes = ["section", lead && "section-lead", paper && "section-paper"].filter(Boolean).join(" ");
  return (
    <section id={id} className={classes}>
      <div className="wrap section-grid">
        <header className="section-label">
          <span className="mono section-index">{index}</span>
          <span className="mono">{label}</span>
        </header>
        <div className="section-body">
          <Heading className="section-title reveal">{title}</Heading>
          {children}
        </div>
      </div>
    </section>
  );
}
