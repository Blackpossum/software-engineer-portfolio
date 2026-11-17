import type { Site } from "@/content/schema";

import { ChipList } from "@/components/ui/ChipList";
import { SectionHead } from "@/components/ui/SectionHead";
import { InlineSvg } from "@/components/visuals/InlineSvg";

type Card = Site["work"]["featured"];

export function Work({ work }: { work: Site["work"] }) {
  const { featured } = work;

  return (
    <section className="section" id={work.id}>
      <div className="container">
        <SectionHead
          aside={<div className="section-meta">{work.meta}</div>}
          eyebrow={work.eyebrow}
          heading={work.heading}
        />
        <a className="work-featured" href={featured.href}>
          <div className="work-featured-visual">
            <InlineSvg className="w-embed" src={featured.visual} />
          </div>
          <WorkBody card={featured} featured />
        </a>
        <div className="work-grid">
          {work.cards.map((card) => (
            <a className="work-card" href={card.href} key={card.href}>
              <InlineSvg className="work-visual" src={card.visual} />
              <WorkBody card={card} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// Text half of a work card; the featured card uses the large title.
function WorkBody({ card, featured }: { card: Card; featured?: boolean }) {
  return (
    <div className={featured ? "work-featured-body" : "work-body"}>
      <div className="work-kicker">{card.kicker}</div>
      <h3 className={featured ? "work-title-l" : "work-title"}>{card.title}</h3>
      <p className="work-desc">{card.desc}</p>
      <ChipList chips={card.chips} size="sm" />
      <div className="work-cta">{card.cta}</div>
    </div>
  );
}
