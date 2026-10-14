# F-01 Repo foundation

**Status:** Approved (signed off with design v1.0, 8 Oct 2026) · **Stage:** 1 · **Size:** M · **Stories:** US-10, US-11 · **Branch:** `chore/F-01-foundation`

**0. Concepts box**

- **Zod and `z.infer`:** one schema gives both runtime validation and TypeScript types. https://zod.dev
- **Playwright projects:** one config runs the same tests in Chromium, Firefox and WebKit. https://playwright.dev/docs/test-projects
- **GitHub Actions:** a workflow file runs the checks on every pull request. https://docs.github.com/actions
- **Vercel Git integration:** every PR gets its own preview URL. https://vercel.com/docs/git
- **Next 16 file conventions:** read the docs bundled in `node_modules/next/dist/docs` before touching `app/` (D-20).

**1. Goal.** A renamed, connected repository where the current kit content and assets live inside the app, typed and validated. Every PR runs the full check pipeline and gets a Vercel preview. No visual work yet.

**2. Acceptance criteria**

1. Given the GitHub account Blackpossum, when the repo list is opened, then `software-engineer-portfolio` exists with `main` pushed and the package name matches.
2. Given the kit at `~/Downloads/portfolio-kit`, when `pnpm sync:kit` runs, then `public/images`, `public/illustrations`, `public/resume.pdf` and `src/content/*.json` match the kit, the four stale Artemis-era files are removed, and nothing from `reference/` is copied.
3. Given valid content, when `pnpm test:unit` runs, then the schema test passes. Given a fixture with an unknown `next` slug, a missing asset file or an em dash, then it fails with a message naming the field.
4. Given a pull request, when CI runs, then lint, typecheck, unit tests, build and the Playwright smoke test (three engines) all run and are required to merge.
5. Given the smoke test, when it loads `/`, then the response is 200 and the console has no errors.
6. Given a pull request, when Vercel builds it, then a preview URL appears on the PR.
7. Given the repository, when CI lists tracked files, then no path under `reference/` is tracked.

**3. API contract**

- `src/content/schema.ts` exports the `SiteSchema` and `CaseStudySchema` Zod schemas, and the `Site`, `CaseStudy` and `CaseBlock` types.
- `src/content/index.ts` exports:
  - `getSite(): Site`
  - `getCases(): CaseStudy[]`
  - `getCase(slug: string): CaseStudy | undefined`
- `package.json` scripts: `sync:kit`, `typecheck`, `test:unit`, `test:e2e`, `lint`, `build`.

**4. Data changes**

- Add `src/content/site.json` and `src/content/cases.json` from the kit.
- Add `public/resume.pdf`.
- Replace `public/illustrations` (add 23 files; remove `card-arch.svg`, `card-code.svg`, `card-streak.svg` and `case-artemis.svg`).
- Refresh `public/images`.
- Bring `src/styles/tokens.css` and `src/styles/site.css` up to the current kit. `site.css` stays as a porting reference only and is not imported.

**5. Frontend states.** Only a placeholder home page that replaces the create-next-app page and its leftover Tailwind classes.

**6. Edge cases**

- Kit path missing: the sync script exits with a clear message and changes nothing.
- Paths are case-sensitive on Vercel's Linux builders.
- Em dashes: the 11 in `site.json` are replaced in F-01 and the schema rejects new ones (D-23). Erwin reviews the new wording, since it is his copy.
- The `placeholders` key is dropped from the schema.
- `sharp` builds are disabled in `pnpm-workspace.yaml`, so check that `next/image` still works on Vercel.

**7. Test plan**

| Test                                                                                              | Criteria |
| ------------------------------------------------------------------------------------------------- | -------- |
| `content.test.ts`: valid content passes; mutated fixtures (bad slug, missing asset, em dash) fail | AC3      |
| `smoke.spec.ts`: `/` returns 200 with no console errors, in three engines                         | AC4, AC5 |
| CI step that fails if `git ls-files` lists `reference/`                                           | AC7      |
| Sync script dry run, then a diff against the kit                                                  | AC2      |
| Manual checks: repo, package name, Vercel preview on the first PR                                 | AC1, AC6 |

**8. Task breakdown (one commit each)**

1. `chore: rename package to software-engineer-portfolio` (Claude Code). Erwin creates the GitHub repo and adds the remote.
2. `chore: replace default page with placeholder` (Claude Code)
3. `chore: add kit sync script and sync content, assets and resume` (Claude Code)
4. `test: add failing content schema test` (Claude Code)
5. `feat: add zod content schema and typed loaders` (Claude Code)
6. `fix(content): replace em dashes in site.json` (Claude Code; Erwin approves the wording)
7. `test: add Playwright with three browser projects and smoke test` (Claude Code)
8. `ci: add GitHub Actions workflow for lint, typecheck, unit, build and e2e` (Claude Code)
9. `chore: add commitlint commit-msg hook` (Claude Code)
10. `docs: README with run and test commands` (Claude Code)
11. Connect the Vercel project in the dashboard (Erwin; no commit)

**9. Out of scope.** Any visual component, tokens and fonts in use (F-02), Lighthouse CI (F-09), custom domain.

**10. Decisions referenced.** D-01, D-06, D-13, D-14, D-15, D-16, D-19, D-20, D-23, D-27.
