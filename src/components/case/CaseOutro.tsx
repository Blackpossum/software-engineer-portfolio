import type { CaseStudy } from "@/content/schema";

export function Glance({ glance }: { glance: CaseStudy["glance"] }) {
  return (
    <div className="glance">
      <div className="case-label">{glance.label}</div>
      <div className="glance-head">
        <div className="glance-th">Aspect</div>
        <div className="glance-th">Before</div>
        <div className="glance-th">After</div>
      </div>
      {glance.rows.map((row) => (
        <div className="glance-row" key={row.aspect}>
          <div className="glance-aspect">{row.aspect}</div>
          <div className="glance-before">
            <span className="glance-tag">Before</span>
            {row.before}
          </div>
          <div className="glance-after">
            <span className="glance-tag">After</span>
            {row.after}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Impact({ impact }: { impact: CaseStudy["impact"] }) {
  return (
    <div className="impact-box">
      <div className="impact-label">{impact.label}</div>
      <p className="impact-text">{impact.text}</p>
    </div>
  );
}

export function NextCase({ next }: { next: CaseStudy["next"] }) {
  return (
    <a className="next-case" href={next.href}>
      <div className="next-label">Next case study</div>
      <div className="next-title">{next.title} →</div>
    </a>
  );
}
