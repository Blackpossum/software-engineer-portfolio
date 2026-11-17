# Progress

**v1 shipped on 17 Nov 2026 (D-30):** all 7 routes and the full motion layer. Next: visual sign-off per route against the Webflow site, then the metrics below.

Production (D-08): https://software-engineer-portfolio-lovat.vercel.app (`software-engineer-portfolio.vercel.app` belongs to someone else). Previews stay behind Vercel login.

The original timebox (D-09) is superseded by D-30.

## Stages

| Stage                                         | Features     | Days     | State       |
| --------------------------------------------- | ------------ | -------- | ----------- |
| 1 Foundation                                  | F-01 to F-03 | 1 to 2   | Done        |
| 2 Static parity                               | F-04 to F-08 | 3 to 5   | Done        |
| 3 Motion foundation and navigation (v1 ships) | F-09, F-10   | 6 to 7   | Done        |
| 4 Signature effects                           | F-11 to F-15 | 8 to 10  | Done        |
| 5 Polish and ship                             | F-16 to F-19 | 11 to 14 | In progress |

## `fx.js` modules ported (26 of 28)

`magnetic` and `magneticBase` are not ported: in `fx.js` they only run without the custom cursor, and the cursor is on for every fine pointer, so neither ever ran on the Webflow site. The mobile menu (not a numbered module) is the `Nav` client component.

- [x] lenis (F-09)
- [x] progress (F-09)
- [x] reveals (F-09)
- [x] links (F-10)
- [x] enter (F-10)
- [x] heroIntro (F-10)
- [x] caseIntro (F-10)
- [x] loader (F-11)
- [x] cursor (F-12)
- [x] spotlight (F-12)
- [x] split (F-13)
- [x] scramble (F-13)
- [x] read (F-13)
- [x] journey (F-14)
- [x] rover (F-15)
- [x] minis (F-15)
- [x] interactions (F-16)
- [x] roll (F-16)
- [ ] magnetic (F-16): not applicable, see above
- [ ] magneticBase (F-16): not applicable, see above
- [x] move (F-16)
- [x] marquee (F-17)
- [x] heroOut (F-17)
- [x] work (F-17)
- [x] case (F-17)
- [x] nav (F-18)
- [x] spy (F-18)
- [x] copy (F-18)

## Routes signed off for visual parity (0 of 7)

- [ ] `/`
- [ ] `/work/rover`
- [ ] `/work/platform`
- [ ] `/work/ess`
- [ ] `/work/promptomat`
- [ ] `/work/parish`
- [ ] 404

## Metrics (Actual column in `docs/design.md` section 9)

Fill these in as they are measured: first-load JavaScript per route (Stage 1 baseline, D-24), Lighthouse scores, leak test result.

## Help ladder: rung 4 (pair) assists

None yet.

## Weak spots to revisit

None yet.

## Webflow sync log (D-22)

Every content change after v1 is listed here with the date the Webflow site got the same change.

| Date       | Change                                                                                                                                                                                                 | Webflow                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| 2026-11-17 | Marquee words moved from `fx.js` into `site.json` (`hero.marquee`); kit updated too (D-29)                                                                                                             | Not needed: same words already on Webflow |
| 2026-10-14 | D-23 em dashes in `site.json` (10 fields): section eyebrows use "01 · About" style; hero intro, about paragraph 2, Promptomat milestone note and OSSU repo description reworded with a colon or commas | Pending: Erwin applies after v1 ships     |

## Session log

### 2026-10-08 · Cowork (design)

- Brainstorm finished. Design document v1.0 signed off by Erwin. No Open decisions.
- Handoff files written: `docs/design.md`, `docs/design.pdf`, `docs/decisions.md`, `docs/brainstorm-notes.md`, `docs/features/F-01-repo-foundation.md`, this file, `CLAUDE.md`.
- `BUILD-GUIDE.md` (local, gitignored) refreshed from the current kit.
- Next: open the repo in Claude Code and say "Start the session ritual". Begin F-01.

### 2026-10-14 · Day 1 · F-01 Repo foundation

**What changed**

- Handoff committed; timebox set with Day 1 = 14 Oct (Erwin's call).
- Tasks 1 to 10 done on `chore/F-01-foundation` (all chores, Claude Code): package rename, placeholder page, `pnpm sync:kit`, failing schema test, Zod schema and loaders, em dash fix (wording approved by Erwin), Playwright with three engines and smoke test, CI workflow, commitlint hook, README.
- Repo pushed to `Blackpossum/software-engineer-portfolio`, default branch set to `main`, PR #1 merged by Erwin. CI green: lint, format, typecheck, 12 unit tests, build, smoke test in Chromium, Firefox and WebKit.
- Vercel connected (task 11, Erwin). Production deploys from `main`.
- History rewritten before the first push (Erwin's request): agent files removed (D-28) and commit trailers dropped. Nothing public was affected.

**Acceptance criteria:** AC1 to AC5 and AC7 met. AC4: the "Protect main" ruleset requires `checks` and blocked a direct push to `main`. AC6: no preview on PR #1 (Vercel was connected after its last push); the PR for this log is the first one Vercel can preview.

**Judgement calls (logged per CLAUDE.md)**

- `tokens.css` is not synced: colours already match the kit, and the kit's font variables would override `next/font`.
- Synced files are in `.prettierignore`, so they stay byte-identical to the kit and the sync dry run can confirm a match.
- The package is an ES module (`"type": "module"`), so Node runs the TypeScript sync script without a warning.
- `ContentSchema` (site and cases together) added to the F-01 API contract: cross-file checks need both files.
- The placeholder page hardcodes two lines of copy until F-04 replaces it.
- WebKit runs in CI only: Playwright's WebKit needs Ubuntu's ICU 74 and Fedora 44 ships 77 (Erwin chose CI only over a container). `pnpm test:e2e:local` runs Chromium and Firefox.
- `pnpm typecheck` runs `next typegen` first: route types such as `LayoutProps` only exist after typegen, dev or build, so the first CI run failed without it.

**New decisions:** D-28 (agent instruction files stay local, `docs/` public), D-29 (content fixes go to the kit and the repo together).

**Teach-back and 2 questions:** pending. PR #1 merged before the teach-back; Erwin adds "How it works" to PR #1, then Claude Code asks 2 questions at the start of the next session.

**Weak spots:** none yet (no Erwin-written code this session).

**Next step:** Erwin: teach-back in PR #1, confirm the Vercel preview on the session log PR, apply the em dash edits to Webflow after v1. Next session: F-02 Tokens, fonts, base reset and shared UI (first feature Erwin codes; Claude Code mentors).

### 2026-11-17 · v1 shipped (D-30 to D-33)

**What changed**

- Home, the five case studies and the 404 render from `site.json` and `cases.json` with the Webflow class names (D-32).
- Motion layer ported from `fx.js` into `src/motion/` (D-33). Pages are separate documents and the wipe covers the load (D-31).
- Animated diagrams play only on screen and hold a still frame for reduced motion (`Diagram` component).
- E2E: every route returns 200 with no console errors, unknown routes 404, the mobile menu and the page wipe work.
- `archive/manual-rebuild-start` keeps the F-01 state for a from-scratch rebuild.

**Next step:** sign off each route against the Webflow site, record first-load JS and Lighthouse in `docs/design.md` section 9.
