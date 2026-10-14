// Content schema test (F-01, AC3). Real content must pass; each broken fixture must fail
// with an issue that names the field, so a bad JSON edit fails CI with a clear message.
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import cases from "./cases.json";
import { getCase, getCases, getSite } from "./index";
import { ContentSchema } from "./schema";
import site from "./site.json";

const PUBLIC_DIR = path.resolve(import.meta.dirname, "../../public");
const EM_DASH = "—";

type Asset = { field: string; src: string };

// Local asset paths (images, illustrations, PDFs) found anywhere in the content.
function collectAssets(value: unknown, field: string): Asset[] {
  if (typeof value === "string") {
    const isAsset =
      /^\/(?:images|illustrations)\//.test(value) ||
      /^\/[^/].*\.pdf$/.test(value);
    return isAsset ? [{ field, src: value }] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectAssets(item, `${field}[${index}]`),
    );
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      collectAssets(item, `${field}.${key}`),
    );
  }
  return [];
}

function freshContent() {
  return structuredClone({ cases, site });
}

function issuePaths(content: unknown): string[] {
  const result = ContentSchema.safeParse(content);
  expect(result.success).toBe(false);
  return result.success
    ? []
    : result.error.issues.map((issue) => issue.path.join("."));
}

function missingAssets(content: unknown): string[] {
  return collectAssets(content, "content")
    .filter(({ src }) => !existsSync(path.join(PUBLIC_DIR, src)))
    .map(({ field, src }) => `${field}: ${src}`);
}

describe("valid content", () => {
  it("passes the schema", () => {
    const result = ContentSchema.safeParse(freshContent());
    expect(result.error?.issues ?? []).toEqual([]);
  });

  it("only references asset files that exist under public/", () => {
    expect(missingAssets(freshContent())).toEqual([]);
  });

  it("loads the site and all five cases in order", () => {
    expect(getSite().meta.name).toBe(site.meta.name);
    expect(getCases().map((c) => c.slug)).toEqual([
      "rover",
      "platform",
      "ess",
      "promptomat",
      "parish",
    ]);
    expect(getCase("ess")?.slug).toBe("ess");
    expect(getCase("artemis")).toBeUndefined();
  });

  it("loops the next links through every case and back to the first", () => {
    const visited: string[] = [];
    let slug: string | undefined = "rover";
    while (slug && !visited.includes(slug)) {
      visited.push(slug);
      slug = getCase(slug)?.next.href.replace("/work/", "");
    }
    expect(visited).toHaveLength(5);
    expect(slug).toBe("rover");
  });
});

describe("broken content fails with the field named", () => {
  it("rejects a case whose next link points to an unknown slug", () => {
    const content = freshContent();
    content.cases[0].next.href = "/work/artemis";
    expect(issuePaths(content)).toContain("cases.0.next.href");
  });

  it("rejects a work card that links to an unknown case", () => {
    const content = freshContent();
    content.site.work.cards[0].href = "/work/artemis";
    expect(issuePaths(content)).toContain("site.work.cards.0.href");
  });

  it("rejects a duplicate case slug", () => {
    const content = freshContent();
    content.cases[1].slug = content.cases[0].slug;
    expect(issuePaths(content)).toContain("cases.1.slug");
  });

  it("rejects an em dash in site copy", () => {
    const content = freshContent();
    content.site.hero.intro = `Frontend engineer ${EM_DASH} shipping`;
    expect(issuePaths(content)).toContain("site.hero.intro");
  });

  it("rejects an em dash in case copy", () => {
    const content = freshContent();
    content.cases[2].lead = `A lead ${EM_DASH} with a dash`;
    expect(issuePaths(content)).toContain("cases.2.lead");
  });

  it("explains the em dash rule in the issue message", () => {
    const content = freshContent();
    content.site.footer.text = `Footer ${EM_DASH} text`;
    const result = ContentSchema.safeParse(content);
    expect(
      result.error?.issues.map((issue) => issue.message).join("\n"),
    ).toMatch(/em dash/i);
  });

  it("rejects a case missing a required field", () => {
    const content = freshContent();
    const broken: Record<string, unknown> = content.cases[3];
    delete broken.lead;
    expect(issuePaths(content)).toContain("cases.3.lead");
  });

  it("reports a missing asset file by its field", () => {
    const content = freshContent();
    content.site.hero.image.src = "/images/missing-portrait.jpg";
    expect(missingAssets(content)).toEqual([
      "content.site.hero.image.src: /images/missing-portrait.jpg",
    ]);
  });
});
