import type { Site } from "@/content/schema";

import { RollText } from "@/components/ui/RollText";

export function Footer({ footer }: { footer: Site["footer"] }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-text">{footer.text}</div>
          <a className="footer-link" href="#">
            <RollText>{footer.backToTop}</RollText>
          </a>
        </div>
      </div>
    </footer>
  );
}
