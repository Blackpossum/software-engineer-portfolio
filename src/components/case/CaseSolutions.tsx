import { Fragment } from "react";

import type { CaseStudy } from "@/content/schema";

import { Img } from "@/components/ui/Img";
import { readSvg } from "@/components/visuals/InlineSvg";

import { CaseList } from "./CaseList";
import { Diagram } from "./Diagram";

type Solution = CaseStudy["solutions"][number];

export function CaseSolutions({ study }: { study: CaseStudy }) {
  const { figure } = study;

  return (
    <div className="case-solutions">
      {study.solutions.map((solution, index) => (
        <Fragment key={solution.label}>
          <SolutionRow solution={solution} />
          {figure?.afterSolution === index + 1 && <Figure figure={figure} />}
        </Fragment>
      ))}
    </div>
  );
}

function Figure({ figure }: { figure: NonNullable<CaseStudy["figure"]> }) {
  return (
    <div className="case-figure">
      {figure.images.map((image) => (
        <Img
          alt={image.alt}
          className="case-figure-img"
          key={image.src}
          src={image.src}
        />
      ))}
      <div className="case-figure-cap">{figure.caption}</div>
    </div>
  );
}

function SolutionRow({ solution }: { solution: Solution }) {
  return (
    <div className="case-solution">
      <div className="case-solution-body">
        <div className="case-label">{solution.label}</div>
        <p className="case-text">{solution.text}</p>
        <CaseList items={solution.items} />
        {solution.link && (
          <a
            className="case-pr-link"
            href={solution.link.href}
            rel="noopener"
            target="_blank"
          >
            {solution.link.label}
          </a>
        )}
        {solution.reference && (
          <div className="case-figure-cap">{solution.reference}</div>
        )}
      </div>
      <div className="case-diagram">
        <Diagram markup={readSvg(solution.diagram)} src={solution.diagram} />
      </div>
    </div>
  );
}
