import type { ReactNode } from "react";

import type { Site } from "@/content/schema";

import { ActionLink } from "@/components/ui/ActionLink";
import { Img } from "@/components/ui/Img";

type Row = Site["contact"]["card"]["rows"][number];

// The footer sits inside this section on the home page, as on the Webflow site.
export function Contact({
  children,
  contact,
}: {
  children: ReactNode;
  contact: Site["contact"];
}) {
  const { card } = contact;

  return (
    <section className="section-contact" id={contact.id}>
      <div className="container">
        <div className="contact-grid">
          <div className="contact-main">
            <div className="eyebrow">{contact.eyebrow}</div>
            <h2 className="heading-contact">
              {contact.heading.text}{" "}
              <span className="text-accent-inline">
                {contact.heading.accent}
              </span>
            </h2>
            <p className="contact-intro">{contact.intro}</p>
            <a className="contact-email" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <div className="contact-actions">
              {contact.actions.map((action) => (
                <ActionLink
                  className={`btn-${action.variant}`}
                  href={action.href}
                  key={action.href}
                  label={action.label}
                />
              ))}
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-profile">
              <Img
                alt={card.avatar.alt}
                className="contact-avatar"
                src={card.avatar.src}
              />
              <div>
                <div className="contact-name">{card.name}</div>
                <div className="contact-role">{card.role}</div>
              </div>
            </div>
            {card.rows.map((row) => (
              <ContactRow key={row.label} row={row} />
            ))}
            <div className="status-pill">
              <span className="status-dot" />
              {card.status}
            </div>
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}

function ContactRow({ row }: { row: Row }) {
  const text = (
    <>
      <div className="contact-row-label">{row.label}</div>
      <div className="contact-row-value">{row.value}</div>
    </>
  );

  if (!row.href) {
    return <div className="contact-row-static">{text}</div>;
  }
  return (
    <a className="contact-row" href={row.href} rel="noopener" target="_blank">
      <div className="contact-row-text">{text}</div>
      <div className="contact-row-arrow">↗</div>
    </a>
  );
}
