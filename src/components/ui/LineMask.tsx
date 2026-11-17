// Heading lines wrapped in a mask, so the intro timeline can slide each line up into view.
type Props = {
  accentIndex?: number;
  lines: string[];
};

export function LineMask({ accentIndex, lines }: Props) {
  return lines.map((line, index) => (
    <span className="line-mask" key={line}>
      <span className={index === accentIndex ? "line text-accent" : "line"}>
        {line}
      </span>
    </span>
  ));
}
