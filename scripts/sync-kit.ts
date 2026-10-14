// Copies content, assets and the résumé from the portfolio kit into the app.
// Usage: pnpm sync:kit [--dry-run]. Kit path: $PORTFOLIO_KIT or ~/Downloads/portfolio-kit.
// Never reads the kit's reference/ folder (D-19). tokens.css is not synced: its colours
// already match, and the repo drops the font variables on purpose because next/font sets them.
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

type Action = "add" | "remove" | "update";
type Change = { action: Action; from?: string; to: string };

const ROOT = path.resolve(import.meta.dirname, "..");
const KIT =
  process.env.PORTFOLIO_KIT ??
  path.join(homedir(), "Downloads", "portfolio-kit");

// Folders mirrored exactly: files missing from the kit are removed from the app.
const MIRRORED_DIRS = [
  { from: "images", to: "public/images" },
  { from: "illustrations", to: "public/illustrations" },
];

const FILES = [
  { from: "resume.pdf", to: "public/resume.pdf" },
  { from: "content/site.json", to: "src/content/site.json" },
  { from: "content/cases.json", to: "src/content/cases.json" },
  { from: "styles/site.css", to: "src/styles/site.css" },
];

function apply(changes: Change[]): void {
  for (const change of changes) {
    if (change.action === "remove") {
      rmSync(change.to);
    } else if (change.from) {
      mkdirSync(path.dirname(change.to), { recursive: true });
      copyFileSync(change.from, change.to);
    }
  }
}

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);
}

function main(): void {
  // Check every source before touching anything, so a partial kit changes nothing.
  if (!existsSync(KIT)) {
    throw new Error(`kit not found at ${KIT}. Set PORTFOLIO_KIT to its path.`);
  }
  const missing = [...MIRRORED_DIRS, ...FILES]
    .map(({ from }) => from)
    .filter((from) => !existsSync(path.join(KIT, from)));
  if (missing.length > 0) {
    throw new Error(`the kit at ${KIT} is missing: ${missing.join(", ")}`);
  }

  const dryRun = process.argv.includes("--dry-run");
  const changes = plan();

  for (const { action, to } of changes) {
    process.stdout.write(`${action.padEnd(6)} ${path.relative(ROOT, to)}\n`);
  }
  if (changes.length === 0) {
    process.stdout.write("sync:kit: already matches the kit.\n");
    return;
  }
  if (dryRun) {
    process.stdout.write(
      `sync:kit: ${changes.length} change(s) planned (dry run, nothing written).\n`,
    );
    return;
  }
  apply(changes);
  process.stdout.write(`sync:kit: ${changes.length} change(s) applied.\n`);
}

function plan(): Change[] {
  const changes: Change[] = [];

  for (const { from, to } of MIRRORED_DIRS) {
    const kitDir = path.join(KIT, from);
    const appDir = path.join(ROOT, to);
    const kitFiles = new Set(listFiles(kitDir));

    for (const name of kitFiles) {
      const change = planFile(path.join(kitDir, name), path.join(appDir, name));
      if (change) {
        changes.push(change);
      }
    }
    for (const name of listFiles(appDir)) {
      if (!kitFiles.has(name)) {
        changes.push({ action: "remove", to: path.join(appDir, name) });
      }
    }
  }

  for (const { from, to } of FILES) {
    const change = planFile(path.join(KIT, from), path.join(ROOT, to));
    if (change) {
      changes.push(change);
    }
  }

  return changes;
}

function planFile(from: string, to: string): Change | undefined {
  if (!existsSync(to)) {
    return { action: "add", from, to };
  }
  return sameBytes(from, to) ? undefined : { action: "update", from, to };
}

function sameBytes(a: string, b: string): boolean {
  return readFileSync(a).equals(readFileSync(b));
}

try {
  main();
} catch (error) {
  console.error(`sync:kit: ${(error as Error).message}\nNothing was changed.`);
  process.exitCode = 1;
}
