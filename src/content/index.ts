// Typed content loaders. Server only: the JSON is validated once at build time, and a
// broken edit fails the build with the field named instead of rendering bad content.
import "server-only";

import type { CaseStudy, Site } from "./schema";

import cases from "./cases.json";
import { ContentSchema } from "./schema";
import site from "./site.json";

const content = ContentSchema.parse({ cases, site });

export function getCase(slug: string): CaseStudy | undefined {
  return content.cases.find((entry) => entry.slug === slug);
}

export function getCases(): CaseStudy[] {
  return content.cases;
}

export function getSite(): Site {
  return content.site;
}
