import { Fragment } from "react";

// Decorative band of tech names under the hero. The motion layer scrolls it with velocity.
export function Marquee({ words }: { words: string[] }) {
  const group = (
    <div className="fx-marquee-group">
      {words.map((word, index) => (
        <Fragment key={word}>
          <span
            className={
              index % 3 === 0 ? "fx-marquee-item is-fill" : "fx-marquee-item"
            }
          >
            {word}
          </span>
          <span className="fx-marquee-sep" />
        </Fragment>
      ))}
    </div>
  );

  return (
    <div aria-hidden="true" className="fx-marquee">
      <div className="fx-marquee-track">
        {group}
        {group}
      </div>
    </div>
  );
}
