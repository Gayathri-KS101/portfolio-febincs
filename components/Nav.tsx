"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { pages, profile } from "@/content/site";

// Site header: the wordmark, a link to each page and the résumé download.
// On phones the links fold into a menu.
export default function Nav() {
  const pathname = usePathname();
  // remembers which page the menu was opened on, so it closes by itself on arriving at another
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="wordmark">
          {profile.name}
        </Link>
        <nav className="nav-links" aria-label="Pages" data-open={open || undefined}>
          {[{ href: "/", label: "Home" }, ...pages].map((page) => (
            <Link
              key={page.href}
              href={page.href}
              aria-current={(pathname.replace(/\/$/, "") || "/") === page.href ? "page" : undefined}
              onClick={() => setOpenOn(null)}
            >
              {page.label}
            </Link>
          ))}
        </nav>
        <a href={profile.resume} className="btn btn-small" download>
          Résumé
        </a>
        <button
          type="button"
          className="mono nav-toggle"
          aria-expanded={open}
          onClick={() => setOpenOn(open ? null : pathname)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
    </header>
  );
}
