import { RollText } from "./RollText";

type Props = {
  className: string;
  href: string;
  label: string;
};

const isExternal = (href: string) =>
  href.startsWith("http") || href.endsWith(".pdf");

// Buttons and text links that roll on hover. PDFs and other sites open in a new tab.
export function ActionLink({ className, href, label }: Props) {
  const external = isExternal(href);
  return (
    <a
      className={className}
      href={href}
      rel={external ? "noopener" : undefined}
      target={external ? "_blank" : undefined}
    >
      <RollText>{label}</RollText>
    </a>
  );
}
