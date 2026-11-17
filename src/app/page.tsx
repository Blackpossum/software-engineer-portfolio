import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Journey } from "@/components/home/Journey";
import { Marquee } from "@/components/home/Marquee";
import { Repos } from "@/components/home/Repos";
import { Skills } from "@/components/home/Skills";
import { Work } from "@/components/home/Work";
import { Footer } from "@/components/layout/Footer";
import { getSite } from "@/content";

export default function Home() {
  const site = getSite();

  return (
    <main className="main">
      <Hero hero={site.hero} />
      <Marquee words={site.hero.marquee} />
      <About about={site.about} />
      <Journey journey={site.journey} />
      <Skills skills={site.skills} />
      <Work work={site.work} />
      <Repos repos={site.repos} />
      <Contact contact={site.contact}>
        <Footer footer={site.footer} />
      </Contact>
    </main>
  );
}
