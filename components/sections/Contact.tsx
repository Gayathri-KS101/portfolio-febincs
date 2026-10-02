import Link from "next/link";
import { pages, profile } from "@/content/site";

// The Contact page: how to reach him, where he is and what he is doing, and the way back
// into the rest of the site
export default function Contact() {
  const reach = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "Alternate email", value: profile.altEmail, href: `mailto:${profile.altEmail}` },
    { label: "LinkedIn", value: profile.linkedinLabel, href: profile.linkedin, external: true },
    { label: "Résumé", value: "Download the PDF", href: profile.resume, download: true },
  ];

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <p className="mono contact-eyebrow">06 Contact</p>
        <h1 className="contact-title">
          Open to embedded software and <em>firmware</em> roles.
        </h1>

        <div className="contact-grid">
          <div>
            <h2 className="mono contact-heading">Reach me</h2>
            <ul className="contact-links">
              {reach.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="holo"
                    download={item.download}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                  >
                    <span className="mono">{item.label}</span>
                    {item.value}
                    <span className="contact-arrow" aria-hidden="true">
                      {item.download ? "↓" : "→"}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mono contact-heading">At a glance</h2>
            <dl className="contact-facts">
              {profile.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="mono">{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mono contact-heading">Quick links</h2>
            <ul className="contact-quick">
              {pages
                .filter((page) => page.href !== "/contact")
                .map((page) => (
                  <li key={page.href}>
                    <Link href={page.href}>{page.label}</Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
