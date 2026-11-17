// Inlines an SVG from public/ at build time. The motion layer animates parts of these
// illustrations (robots, cells, lines), which it can only reach when the SVG is in the DOM.
import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";

const cache = new Map<string, string>();

type Props = {
  className?: string;
  src: string;
};

export function InlineSvg({ className, src }: Props) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: readSvg(src) }}
    />
  );
}

export function readSvg(src: string): string {
  let markup = cache.get(src);
  if (!markup) {
    markup = readFileSync(path.join(process.cwd(), "public", src), "utf8");
    cache.set(src, markup);
  }
  return markup;
}
