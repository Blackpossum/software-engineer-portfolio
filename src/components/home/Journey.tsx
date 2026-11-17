import type { Site } from "@/content/schema";

import { SectionHead } from "@/components/ui/SectionHead";

type Milestone = Site["journey"]["milestones"][number];

export function Journey({ journey }: { journey: Site["journey"] }) {
  return (
    <section className="section" id={journey.id}>
      <div className="container">
        <SectionHead eyebrow={journey.eyebrow} heading={journey.heading} />
        <div className="timeline">
          <div className="timeline-track" />
          <div className="timeline-progress" />
          <div className="timeline-grid">
            {journey.milestones.map((milestone) => (
              <MilestoneCard key={milestone.title} milestone={milestone} />
            ))}
          </div>
        </div>
        <div className="callout">
          <div className="callout-date">{journey.callout.date}</div>
          <p className="callout-text">{journey.callout.text}</p>
        </div>
      </div>
    </section>
  );
}

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const now = milestone.current ? "-now" : "";
  const date = <div className="milestone-date">{milestone.date}</div>;

  return (
    <div className="milestone">
      <div className={`milestone-dot${now}`} />
      <div className={`milestone-card${now}`}>
        {milestone.current ? (
          <div className="milestone-top">
            {date}
            <div className="chip-now">Now</div>
          </div>
        ) : (
          date
        )}
        <h3 className="milestone-title">{milestone.title}</h3>
        <div className="milestone-role">{milestone.role}</div>
        <p className="milestone-note">{milestone.note}</p>
      </div>
    </div>
  );
}
