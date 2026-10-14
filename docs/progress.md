# Progress

**Next feature: F-02 Tokens, fonts, base reset and shared UI.** F-01 merged on 14 Oct (PR #1); its teach-back is still pending.

Production (D-08): https://software-engineer-portfolio-lovat.vercel.app (`software-engineer-portfolio.vercel.app` belongs to someone else). Previews stay behind Vercel login.

Current stage: 1, Foundation (Days 1 to 2). Day 1 is 14 Oct 2026 (Erwin's call, 14 Oct). Target for full parity: Day 14 = 27 Oct; hard cap Day 21 = 3 Nov.

Timebox (D-09): full parity in 14 days, hard cap 21. Week 1 (Days 1 to 7) must end with a shippable v1 on `vercel.app`.

## Stages

| Stage                                         | Features     | Days     | State       |
| --------------------------------------------- | ------------ | -------- | ----------- |
| 1 Foundation                                  | F-01 to F-03 | 1 to 2   | In progress |
| 2 Static parity                               | F-04 to F-08 | 3 to 5   | Not started |
| 3 Motion foundation and navigation (v1 ships) | F-09, F-10   | 6 to 7   | Not started |
| 4 Signature effects                           | F-11 to F-15 | 8 to 10  | Not started |
| 5 Polish and ship                             | F-16 to F-19 | 11 to 14 | Not started |

## `fx.js` modules ported (0 of 28)

- [ ] lenis (F-09)
- [ ] progress (F-09)
- [ ] reveals (F-09)
- [ ] links (F-10)
- [ ] enter (F-10)
- [ ] heroIntro (F-10)
- [ ] caseIntro (F-10)
- [ ] loader (F-11)
- [ ] cursor (F-12)
- [ ] spotlight (F-12)
- [ ] split (F-13)
- [ ] scramble (F-13)
- [ ] read (F-13)
- [ ] journey (F-14)
- [ ] rover (F-15)
- [ ] minis (F-15)
- [ ] interactions (F-16)
- [ ] roll (F-16)
- [ ] magnetic (F-16)
- [ ] magneticBase (F-16)
- [ ] move (F-16)
- [ ] marquee (F-17)
- [ ] heroOut (F-17)
- [ ] work (F-17)
- [ ] case (F-17)
- [ ] nav (F-18)
- [ ] spy (F-18)
- [ ] copy (F-18)

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

| Date       | Change                                                                                                                                                                                                 | Webflow                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| 2026-10-14 | D-23 em dashes in `site.json` (10 fields): section eyebrows use "01 · About" style; hero intro, about paragraph 2, Promptomat milestone note and OSSU repo description reworded with a colon or commas | Pending: Erwin applies after v1 ships |

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
