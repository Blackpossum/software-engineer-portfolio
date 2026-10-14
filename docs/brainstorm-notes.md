# Brainstorm notes

Cowork session, 8 Oct 2026. This is the raw summary behind `docs/design.md` v1.0, including the ideas we rejected and why. Decision IDs match `docs/decisions.md`.

## Kickoff

- **Project:** a React (Next.js) rebuild of the Webflow portfolio. This was a resume, not a fresh start. `portofolio_dev` already had 7 commits from 3 Oct:
  - Next 16.3.8 and React 19.2.8, with gsap, `@gsap/react` and lenis installed
  - fonts loaded through `next/font`
  - strict ESLint, Prettier, Husky and pnpm
  - assets from the 3 Oct kit
  - the create-next-app page still in place
  - no remote, tests or docs
- **The other folder:** `~/software_development/portfolio` (an old static HTML version and the Next.js Learn dashboard) is not part of this project.
- **Audience (confirmed by Erwin):**
  - Primary: hiring managers and recruiters for remote React and full-stack roles, Europe first.
  - Secondary: engineers in a technical screen who open the repo.
- **Repo name (D-01):**
  - Erwin first proposed `software_engineer_portofolio`.
  - Claude flagged that "portofolio" is the misspelling we were renaming away from.
  - Erwin chose the corrected `software-engineer-portfolio`.
- **Webflow site (D-02):** it stays live in parallel. Erwin sends the React link when a role asks for React evidence. Retiring Webflow is optional.

## Topic 1: the problem

- **Erwin agreed with all three drivers:**
  - no React evidence (his strongest work is under NDA)
  - no ownership (`webflow.io` subdomain)
  - updates need the Webflow Designer
- **Claude's pushback:** the Webflow site already works for applications. So the rebuild only pays off as a portfolio piece in its own right, and it needs a fixed timebox.
- **Timebox:** first 1 week (D-03), later changed to 2 weeks with a 3-week cap (D-09).

## Topic 2: existing alternatives (researched 8 Oct 2026)

- **No-code builders (Webflow, Framer):**
  - Free plans only give a subdomain.
  - A custom domain costs $15 per month on Webflow Basic (billed yearly) or $10 per month on Framer Basic.
  - Neither shows React.
- **Starter templates (Vercel Portfolio Starter Kit):** a generic look. They prove deployment, not engineering.
- **Profile platforms (GitHub README, LinkedIn, Peerlist):** no room for case studies, and NDA work stays invisible.
- **Hosted profile tools are fragile:**
  - Read.cv began winding down in Jan 2025 after Perplexity acquired it.
  - Bento shut down on 13 Feb 2026, and its links redirect to Linktree.
- **Rejected: a blog in v1 (D-04).** It doesn't fit the timebox, and an empty blog looks worse than none. Erwin agreed.
- **Assumption, not evidence:** "recruiters give a portfolio a minute or two". It is used for priorities only.

## Topic 3: the recruiter angle

- **Accepted:** the hard problem is moving a 28-module GSAP motion layer into React. It has three parts:
  - motion that survives navigation without leaks
  - heavy motion with a fast first paint
  - motion that never hurts accessibility
- **Interview story:** "motion-heavy, but fast, accessible and leak-free", backed by tests.
- **Rejected framing:** "I rebuilt my site in Next.js". It's too weak to be evidence.

## DIY mode (D-06, D-07)

- **Options considered:**
  1. Erwin writes everything, Claude Code only mentors. Rejected: too slow for full motion parity.
  2. Claude Code writes everything. Rejected: none of it would be Erwin's evidence.
  3. Mixed. Chosen.
- **The mixed mode:** Erwin writes the components and pages. Claude Code implements the chores (asset sync, content schema, tests, CI, config, deploys) and mentors the whole time.
- **Erwin's concern:** "I'm afraid I won't understand and get stuck." The answer:
  - **Help ladder:** explain, hint, skeleton, pair, with a 30-minute rule.
  - **Easy-to-hard order:** static components first, new APIs later.
  - **Concepts box:** every spec opens with one.
  - **Teach-back:** in every PR, which doubles as interview prep.
- **Erwin asked why Claude can't also be his mentor.** Answer: it is. Mentoring is the default role, and implementing is limited to chores.

## Topic 4: scope

- **Claude's proposal (rejected by Erwin):**
  - v1 in week 1 (static parity, motion foundation, transition, intros, CI).
  - v1.1 after (the remaining effects), with a cut list for when time runs short.
  - Erwin preferred more time over cuts.
- **D-09:** full parity in 2 weeks, with a 3-week hard cap. Week 1 still ends shippable. Week 3 is buffer only.
- **D-26:** if 3 weeks is not enough, re-plan with Erwin before cutting anything. No cut list was agreed.
- **D-08:** custom domain later. v1 ships on `vercel.app`.
- **Out of scope:** blog, CMS, i18n, analytics, light mode, contact form, redesign (D-05), the Artemis case study.

## Topic 5: architecture and stack

Accepted (D-10 to D-18), with what each one replaced:

| Accepted                       | Rejected alternative and why                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| Every route static             | Rendering per request: no dynamic data                                                             |
| GSAP, `@gsap/react`, Lenis     | Motion (Framer Motion): would mean rewriting all 28 modules, and it has no SplitText or MotionPath |
| Custom `TransitionProvider`    | `<ViewTransition>` first: the destination title panel is hard in CSS. It stays as the fallback     |
| JSON plus schema check         | MDX or a CMS: the content is already exported                                                      |
| Playwright and Vitest          | Component unit tests: they add little for static markup                                            |
| CI on every PR                 | Manual checks                                                                                      |
| Keep the existing tooling      |                                                                                                    |
| CSS Modules                    | Global `site.css`: shows no React structure. Tailwind: rewriting 2,273 lines of CSS                |
| Motion via `data-*` attributes | Class selectors: CSS Modules hash the class names                                                  |

## Topic 6: risks

- **Risks discussed:**
  - getting stuck
  - schedule slip
  - Next 16 differing from Claude's training data
  - hydration errors
  - ScrollTrigger leaks
  - stale assets
  - NDA
  - content drift
  - Core Web Vitals
  - Safari, since Erwin is on Fedora
  - Vercel Hobby being non-commercial
- **Mitigations logged as D-19 to D-22:** NDA-safe repo contents, bundled Next docs, WebKit in CI, content sync.

## Sign-off (8 Oct 2026)

- **D-22, changed by Erwin:** both sites stay full showcases. Every content change goes to the JSON and to the Webflow site in the same session. Rejected alternatives:
  - JSON first, with Webflow getting critical fixes only
  - Webflow leads
  - freezing Webflow
- **D-23, accepted:** remove all 11 em dashes from `site.json` during the port, and add a schema rule that rejects them.
- **D-24 to D-27, accepted:** a JavaScript budget from the Stage 1 baseline, a test-only trigger count hook, re-plan before cutting, Zod with `z.infer`.
- **Result:** no Open rows left. Design document bumped to v1.0.
