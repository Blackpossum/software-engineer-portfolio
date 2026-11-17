// A plain <img>. site.css sizes these images and the motion layer transforms them
// (clip, scale, parallax), which next/image's wrapper and inline sizing would fight.
type Props = {
  alt: string;
  className: string;
  lazy?: boolean;
  src: string;
};

export function Img({ alt, className, lazy = true, src }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- see the note above
    <img
      alt={alt}
      className={className}
      loading={lazy ? "lazy" : "eager"}
      src={src}
    />
  );
}
