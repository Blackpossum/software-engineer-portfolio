import type { CaseBlock, CaseStudy } from "@/content/schema";

import { ChipList } from "@/components/ui/ChipList";

import { CaseList } from "./CaseList";

// Two columns, as on the Webflow site: text and chips on the left, lists on the right.
export function CaseBlocks({ blocks }: { blocks: CaseStudy["blocks"] }) {
  const columns = [
    blocks.filter((block) => block.type !== "list"),
    blocks.filter((block) => block.type === "list"),
  ];

  return (
    <div className="case-grid">
      {columns.map((column, index) => (
        <div className="case-col" key={index}>
          {column.map((block) => (
            <Block block={block} key={block.label} />
          ))}
        </div>
      ))}
    </div>
  );
}

// The reflection pair shares the same two-column layout, one text block per column.
export function CaseReflection({
  reflection,
}: {
  reflection: CaseStudy["reflection"];
}) {
  return (
    <div className="case-reflect">
      <div className="case-grid">
        {reflection.map((item) => (
          <div className="case-col" key={item.label}>
            <Block block={{ ...item, type: "text" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Block({ block }: { block: CaseBlock }) {
  return (
    <div className="case-block">
      <div className="case-label">{block.label}</div>
      {block.type === "text" && <p className="case-text">{block.text}</p>}
      {block.type === "list" && <CaseList items={block.items} />}
      {block.type === "chips" && <ChipList chips={block.items} />}
    </div>
  );
}
