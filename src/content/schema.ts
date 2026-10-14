// Content schema (D-13, D-27). One source for runtime validation and the content types.
// App code imports the types only (`import type`), so Zod never reaches the browser.
import { z } from "zod";

const EM_DASH = "—";

// Every string in the content goes through Text, so an em dash fails at its own field (D-23).
const Text = z.string().refine((value) => !value.includes(EM_DASH), {
  message:
    "No em dash (U+2014): use a colon, comma, parentheses or a full stop (D-23)",
});

const Link = z.object({ href: Text, label: Text });
const Image = z.object({ alt: Text, src: Text });
const Action = Link.extend({ variant: z.enum(["primary", "secondary"]) });
const LabelText = z.object({ label: Text, text: Text });
const Stat = z.object({ label: Text, sub: Text, value: Text });

// Section ids are fixed because nav anchors depend on them (design.md section 6, rule 6).
const Section = <Id extends string>(id: Id) =>
  z.object({ eyebrow: Text, heading: Text, id: z.literal(id) });

const WorkCard = z.object({
  chips: z.array(Text),
  cta: Text,
  desc: Text,
  href: Text,
  kicker: Text,
  title: Text,
  visual: Text,
});

export const SiteSchema = z.object({
  about: Section("about").extend({
    image: Image,
    paragraphs: z.array(Text).min(1),
    stats: z.array(Stat).min(1),
  }),
  contact: Section("contact").extend({
    actions: z.array(Action),
    card: z.object({
      avatar: Image,
      name: Text,
      role: Text,
      rows: z.array(
        z.object({ href: Text.nullable(), label: Text, value: Text }),
      ),
      status: Text,
    }),
    email: z.email(),
    heading: z.object({ accent: Text, text: Text }),
    intro: Text,
  }),
  footer: z.object({ backToTop: Text, text: Text }),
  hero: z.object({
    accentLineIndex: z.int().nonnegative(),
    actions: z.array(Action),
    cardCode: z.array(Text),
    headingLines: z.array(Text).min(1),
    image: Image,
    intro: Text,
    location: Text,
    stack: Text,
    status: Text,
  }),
  journey: Section("journey").extend({
    callout: z.object({ date: Text, text: Text }),
    milestones: z
      .array(
        z.object({
          current: z.boolean(),
          date: Text,
          note: Text,
          role: Text,
          title: Text,
        }),
      )
      .min(1),
  }),
  meta: z.object({
    email: z.email(),
    github: Text,
    linkedin: Text,
    location: Text,
    name: Text,
    resumeUrl: Text,
    role: Text,
    shortName: Text,
    timezone: Text,
    whatsapp: Text,
  }),
  nav: z.object({
    cta: Link,
    links: z.array(Link),
    logo: z.object({ prefix: Text, text: Text }),
  }),
  repos: Section("github").extend({
    items: z.array(
      z.object({
        desc: Text,
        href: Text,
        lang: Text,
        langKey: Text,
        slug: Text,
        title: Text,
      }),
    ),
    profileLink: Link,
  }),
  skills: Section("skills").extend({
    extra: z.array(z.object({ label: Text, value: Text })),
    groups: z.array(
      z.object({
        chips: z.array(z.object({ label: Text, primary: z.boolean() })),
        num: Text,
        sub: Text,
        title: Text,
      }),
    ),
    legend: z.array(Text),
  }),
  work: Section("work").extend({
    cards: z.array(WorkCard),
    featured: WorkCard,
    meta: Text,
  }),
});

const CaseBlockSchema = z.discriminatedUnion("type", [
  z.object({ label: Text, text: Text, type: z.literal("text") }),
  z.object({
    items: z.array(Text).min(1),
    label: Text,
    type: z.literal("list"),
  }),
  z.object({
    items: z.array(Text).min(1),
    label: Text,
    type: z.literal("chips"),
  }),
]);

export const CaseStudySchema = z.object({
  blocks: z.array(CaseBlockSchema).min(1),
  caption: Text,
  eyebrow: Text,
  figure: z
    .object({
      afterSolution: z.int().nonnegative(),
      caption: Text,
      images: z.array(Image).min(1),
    })
    .optional(),
  glance: z.object({
    label: Text,
    rows: z.array(z.object({ after: Text, aspect: Text, before: Text })).min(1),
  }),
  impact: LabelText,
  lead: Text,
  legacyPath: Text,
  links: z.array(Link).optional(),
  meta: z.array(z.object({ label: Text, value: Text })),
  ndaNote: Text.optional(),
  next: z.object({ href: Text, title: Text }),
  note: Text.optional(),
  pdf: Link,
  reflection: z.array(LabelText),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slugs are lowercase letters, digits and hyphens"),
  solutions: z.array(
    z.object({
      diagram: Text,
      items: z.array(Text),
      label: Text,
      link: Link.optional(),
      reference: Text.optional(),
      text: Text,
    }),
  ),
  stats: z.array(
    Stat.extend({
      countTo: z.number().optional(),
      suffix: z.string().optional(),
    }),
  ),
  titleLines: z.array(Text).min(1),
  visual: Text,
});

const CASE_HREF = /^\/work\/([a-z0-9-]+)$/;

// Checks that need both files: unique slugs, and every case link pointing at a real case.
export const ContentSchema = z
  .object({ cases: z.array(CaseStudySchema).min(1), site: SiteSchema })
  .superRefine(({ cases, site }, ctx) => {
    const slugs = new Set<string>();
    for (const [index, { slug }] of cases.entries()) {
      if (slugs.has(slug)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate case slug "${slug}"`,
          path: ["cases", index, "slug"],
        });
      }
      slugs.add(slug);
    }

    const checkCaseHref = (href: string, path: (number | string)[]) => {
      const slug = CASE_HREF.exec(href)?.[1];
      if (!slug || !slugs.has(slug)) {
        ctx.addIssue({
          code: "custom",
          message: `"${href}" does not link to a known case slug`,
          path,
        });
      }
    };

    for (const [index, { next }] of cases.entries()) {
      checkCaseHref(next.href, ["cases", index, "next", "href"]);
    }
    checkCaseHref(site.work.featured.href, [
      "site",
      "work",
      "featured",
      "href",
    ]);
    for (const [index, card] of site.work.cards.entries()) {
      checkCaseHref(card.href, ["site", "work", "cards", index, "href"]);
    }
  });

export type CaseBlock = z.infer<typeof CaseBlockSchema>;
export type CaseStudy = z.infer<typeof CaseStudySchema>;
export type Site = z.infer<typeof SiteSchema>;
