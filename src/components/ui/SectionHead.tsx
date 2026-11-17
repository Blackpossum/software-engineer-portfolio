import type { ReactNode } from "react";

type Props = {
  aside?: ReactNode;
  eyebrow: string;
  heading: string;
};

// Eyebrow and heading. With an `aside` (legend, meta, link) they sit in a row.
export function SectionHead({ aside, eyebrow, heading }: Props) {
  const title = (
    <>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="heading-l">{heading}</h2>
    </>
  );

  if (!aside) {
    return <div className="section-head">{title}</div>;
  }
  return (
    <div className="section-head-row">
      <div className="section-head-left">{title}</div>
      {aside}
    </div>
  );
}
