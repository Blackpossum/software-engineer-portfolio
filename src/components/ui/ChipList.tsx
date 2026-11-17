type Chip = { label: string; primary?: boolean };

type Props = {
  chips: Chip[] | string[];
  size?: "md" | "sm";
};

export function ChipList({ chips, size = "md" }: Props) {
  return (
    <div className="chip-list">
      {chips.map((item) => {
        const chip = typeof item === "string" ? { label: item } : item;
        return (
          <span className={chipClass(chip, size)} key={chip.label}>
            {chip.label}
          </span>
        );
      })}
    </div>
  );
}

// Primary chips are the lime "daily drivers"; small chips sit on the work cards.
function chipClass(chip: Chip, size: Props["size"]) {
  if (size === "sm") {
    return "chip-sm";
  }
  return chip.primary ? "chip-accent" : "chip";
}
