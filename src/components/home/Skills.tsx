import type { Site } from "@/content/schema";

import { ChipList } from "@/components/ui/ChipList";
import { SectionHead } from "@/components/ui/SectionHead";

export function Skills({ skills }: { skills: Site["skills"] }) {
  const [primaryLabel, usedLabel] = skills.legend;
  const legend = (
    <div className="legend">
      <div className="legend-item">
        <span className="legend-dot-accent" />
        {primaryLabel}
      </div>
      <div className="legend-item">
        <span className="legend-dot" />
        {usedLabel}
      </div>
    </div>
  );

  return (
    <section className="section" id={skills.id}>
      <div className="container">
        <SectionHead
          aside={legend}
          eyebrow={skills.eyebrow}
          heading={skills.heading}
        />
        <div className="skills-grid">
          {skills.groups.map((group) => (
            <div className="skill-card" key={group.title}>
              <div className="skill-num">{group.num}</div>
              <h3 className="skill-title">{group.title}</h3>
              <p className="skill-sub">{group.sub}</p>
              <div className="divider" />
              <ChipList chips={group.chips} />
            </div>
          ))}
        </div>
        <div className="skills-extra">
          {skills.extra.map((row) => (
            <div className="extra-row" key={row.label}>
              <div className="extra-label">{row.label}</div>
              <div className="extra-value">{row.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
