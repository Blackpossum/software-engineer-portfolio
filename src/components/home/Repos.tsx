import type { Site } from "@/content/schema";

import { ActionLink } from "@/components/ui/ActionLink";
import { SectionHead } from "@/components/ui/SectionHead";

export function Repos({ repos }: { repos: Site["repos"] }) {
  return (
    <section className="section" id={repos.id}>
      <div className="container">
        <SectionHead
          aside={
            <ActionLink
              className="link-accent"
              href={repos.profileLink.href}
              label={repos.profileLink.label}
            />
          }
          eyebrow={repos.eyebrow}
          heading={repos.heading}
        />
        <div className="repo-grid">
          {repos.items.map((repo) => (
            <a
              className="repo-card"
              href={repo.href}
              key={repo.slug}
              rel="noopener"
              target="_blank"
            >
              <div className="repo-top">
                <div className="repo-icon" />
                <div className="repo-arrow">↗</div>
              </div>
              <h3 className="repo-title">{repo.title}</h3>
              <div className="repo-slug">{repo.slug}</div>
              <p className="repo-desc">{repo.desc}</p>
              <div className="repo-lang">
                <span className={`lang-dot-${repo.langKey}`} />
                {repo.lang}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
