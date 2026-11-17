import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { CaseBlocks, CaseReflection } from "@/components/case/CaseBlocks";
import { CaseHero } from "@/components/case/CaseHero";
import { Glance, Impact, NextCase } from "@/components/case/CaseOutro";
import { CaseSolutions } from "@/components/case/CaseSolutions";
import { Footer } from "@/components/layout/Footer";
import { getCase, getCases, getSite } from "@/content";

// Only the five known cases exist; any other slug is a 404 at build time.
export const dynamicParams = false;

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCase(slug);
  if (!study) {
    notFound();
  }

  return (
    <>
      <main className="main">
        <CaseHero study={study} />
        <section className="case-section">
          <div className="container">
            <CaseBlocks blocks={study.blocks} />
            <CaseSolutions study={study} />
            <Glance glance={study.glance} />
            <CaseReflection reflection={study.reflection} />
            <Impact impact={study.impact} />
            <NextCase next={study.next} />
          </div>
        </section>
      </main>
      <Footer footer={getSite().footer} />
    </>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCase(slug);
  return study
    ? {
        description: study.lead,
        title: `${study.titleLines.join(" ")} | ${getSite().meta.name}`,
      }
    : {};
}

export function generateStaticParams() {
  return getCases().map(({ slug }) => ({ slug }));
}
