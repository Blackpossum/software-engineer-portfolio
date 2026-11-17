import type { Site } from "@/content/schema";

import { ActionLink } from "@/components/ui/ActionLink";
import { Img } from "@/components/ui/Img";
import { LineMask } from "@/components/ui/LineMask";

export function Hero({ hero }: { hero: Site["hero"] }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <h1 className="heading-xl">
              <LineMask
                accentIndex={hero.accentLineIndex}
                lines={hero.headingLines}
              />
            </h1>
            <p className="text-l hero-intro">{hero.intro}</p>
            <div className="hero-actions">
              {hero.actions.map((action) => (
                <ActionLink
                  className={`btn-${action.variant}`}
                  href={action.href}
                  key={action.href}
                  label={action.label}
                />
              ))}
            </div>
            <div className="mono-label hero-stack">{hero.stack}</div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-code">
                {hero.cardCode.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
              <Img
                alt={hero.image.alt}
                className="hero-photo"
                lazy={false}
                src={hero.image.src}
              />
              <div className="hero-location">
                <span className="dot-accent" />
                {hero.location}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
