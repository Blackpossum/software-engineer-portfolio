// Two stacked copies of a label: on hover the first slides up and the second (lime) rolls in.
// The duplicate is hidden from screen readers so the label is announced once.
export function RollText({ children }: { children: string }) {
  return (
    <span className="fx-roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
