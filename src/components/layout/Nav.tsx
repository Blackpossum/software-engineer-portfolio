"use client";

import { useEffect, useRef, useState } from "react";

import type { Site } from "@/content/schema";

import { ActionLink } from "@/components/ui/ActionLink";
import { RollText } from "@/components/ui/RollText";
import { prefersReducedMotion } from "@/motion/env";
import { gsap } from "@/motion/gsap";

const TABLET_MAX = 991;

export function Nav({ nav }: { nav: Site["nav"] }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  // The menu only collapses on tablet and below; widening the window closes it.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > TABLET_MAX) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (open && menuRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        menuRef.current.querySelectorAll("a"),
        { opacity: 0, y: 16 },
        { duration: 0.4, ease: "power3.out", opacity: 1, stagger: 0.05, y: 0 },
      );
    }
  }, [open]);

  const closeOnTablet = () => {
    if (window.innerWidth <= TABLET_MAX) {
      setOpen(false);
    }
  };

  return (
    <header className="nav">
      <div className="container">
        <div className="nav-inner">
          <a className="nav-logo" href="/">
            <span className="nav-logo-accent">{nav.logo.prefix}</span>
            {nav.logo.text}
          </a>
          <nav
            className={open ? "nav-menu is-open" : "nav-menu"}
            onClick={closeOnTablet}
            ref={menuRef}
          >
            {nav.links.map((link) => (
              <a className="nav-link" href={link.href} key={link.href}>
                <RollText>{link.label}</RollText>
              </a>
            ))}
            <ActionLink
              className="btn-nav"
              href={nav.cta.href}
              label={nav.cta.label}
            />
          </nav>
          <button
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="nav-toggle"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>
        </div>
      </div>
    </header>
  );
}
