import type { CaseStudy } from "@/content/schema";

import { ActionLink } from "@/components/ui/ActionLink";
import { LineMask } from "@/components/ui/LineMask";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { InlineSvg } from "@/components/visuals/InlineSvg";

export function CaseHero({ study }: { study: CaseStudy }) {
  const buttons = [study.pdf, ...(study.links ?? [])];
  const note = study.ndaNote ?? study.note;

  return (
    <section className="case-hero">
      <div className="container">
        <a className="case-back" href="/#work">
          ← All work
        </a>
        <div className="eyebrow">{study.eyebrow}</div>
        <h1 className="heading-case">
          <LineMask lines={study.titleLines} />
        </h1>
        <p className="case-lead">{study.lead}</p>
        <div className="case-meta">
          {study.meta.map((item) => (
            <div className="case-meta-item" key={item.label}>
              <div className="case-meta-label">{item.label}</div>
              <div className="case-meta-value">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="case-actions">
          {buttons.map((link) => (
            <ActionLink
              className="btn-secondary"
              href={link.href}
              key={link.href}
              label={link.label}
            />
          ))}
          {note && <p className="case-note">{note}</p>}
        </div>
        <div className="case-visual">
          <InlineSvg className="w-embed case-embed" src={study.visual} />
        </div>
        <div className="case-caption">{study.caption}</div>
        <StatsGrid
          className={
            study.stats.length === 3 ? "stats-grid stats-grid-3" : "stats-grid"
          }
          stats={study.stats}
        />
      </div>
    </section>
  );
}
