import { Footer } from "@/components/layout/Footer";
import { ActionLink } from "@/components/ui/ActionLink";
import { LineMask } from "@/components/ui/LineMask";
import { getSite } from "@/content";

// Reuses the case hero styles, so the 404 looks like part of the site.
export default function NotFound() {
  return (
    <>
      <main className="main">
        <section className="case-hero">
          <div className="container">
            <div className="eyebrow">404 · Page not found</div>
            <h1 className="heading-case">
              <LineMask lines={["This page", "doesn't exist."]} />
            </h1>
            <p className="case-lead">
              The link may be old, or the address has a typo. The work is still
              where it was.
            </p>
            <div className="case-actions">
              <ActionLink
                className="btn-primary"
                href="/"
                label="Back home →"
              />
              <ActionLink
                className="btn-secondary"
                href="/#work"
                label="See the work"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer footer={getSite().footer} />
    </>
  );
}
