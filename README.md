# Software Engineer Portfolio

The React rebuild of my portfolio site: Next.js 16 (App Router), React 19 and TypeScript, with a GSAP motion layer. Every route is static, all copy lives in typed JSON, and every pull request runs the full check pipeline.

The rebuild is in progress. The design, decisions and feature specs are in [`docs/`](docs/).

## Requirements

- Node 22 or newer
- pnpm (the version is pinned in `package.json`)

## Run it

```bash
pnpm install
pnpm dev
```

The dev server runs on http://localhost:3000. For the production build:

```bash
pnpm build
pnpm start
```

## Check it

| Command               | What it does                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| `pnpm lint`           | ESLint, 0 warnings allowed                                                                          |
| `pnpm format:check`   | Prettier                                                                                            |
| `pnpm typecheck`      | TypeScript, strict                                                                                  |
| `pnpm test:unit`      | Vitest: the content schema test                                                                     |
| `pnpm test:e2e`       | Playwright against the production build, in Chromium, Firefox and WebKit                            |
| `pnpm test:e2e:local` | The same, Chromium and Firefox only (for hosts that cannot run Playwright's WebKit, such as Fedora) |

Before the first end-to-end run, install the browsers with `pnpm exec playwright install`.

CI (`.github/workflows/ci.yml`) runs all of these on every pull request, plus a guard that fails if anything under `reference/` is tracked.

## Content

All visible copy is in `src/content/site.json` and `src/content/cases.json`. A Zod schema (`src/content/schema.ts`) validates both files, and the TypeScript types are inferred from it. A broken edit fails the unit test and the build, with the field named. For example: an unknown case link, a missing image, or an em dash.

`pnpm sync:kit` copies content, images, illustrations and the résumé from the local portfolio kit (`~/Downloads/portfolio-kit`, or set `PORTFOLIO_KIT`). Add `--dry-run` to preview the changes.

## Commits

Conventional commits, checked by a commit-msg hook (commitlint). Lint-staged formats staged files before each commit.
