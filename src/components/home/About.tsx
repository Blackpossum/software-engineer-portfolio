import type { Site } from "@/content/schema";

import { Img } from "@/components/ui/Img";
import { StatsGrid } from "@/components/ui/StatsGrid";

export function About({ about }: { about: Site["about"] }) {
  const [lead, ...rest] = about.paragraphs;

  return (
    <section className="section" id={about.id}>
      <div className="container">
        <div className="about-grid">
          <div>
            <div className="eyebrow">{about.eyebrow}</div>
            <h2 className="heading-l">{about.heading}</h2>
            <div className="about-story">
              <p className="text-lead">{lead}</p>
              {rest.map((paragraph) => (
                <p className="text-l" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="about-photo-wrap">
            <Img
              alt={about.image.alt}
              className="about-photo"
              src={about.image.src}
            />
          </div>
        </div>
        <StatsGrid
          className="stats-grid stats-grid-5"
          leadFirst
          stats={about.stats}
        />
      </div>
    </section>
  );
}
