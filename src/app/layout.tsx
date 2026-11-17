import type { Metadata } from "next";

import { Inter, JetBrains_Mono } from "next/font/google";

import { Nav } from "@/components/layout/Nav";
import { BootScript, Overlays } from "@/components/layout/Overlays";
import { getCases, getSite } from "@/content";
import { Motion } from "@/motion/Motion";

import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font--sans",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font--mono",
  weight: ["400", "500", "700"],
});

const site = getSite();

export const metadata: Metadata = {
  description: site.hero.intro,
  title: `${site.meta.name} | ${site.meta.role}`,
};

// Page titles shown on the wipe while the next page loads. Each case names the one after
// it, and the cases loop, so together they name every case.
const pageNames: Record<string, string> = Object.fromEntries([
  ["/", "Home"],
  ...getCases().map(({ next }) => [next.href, next.title]),
]);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      className={`${sans.variable} ${mono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <BootScript />
      </head>
      <body>
        <Overlays meta={site.meta} />
        <div className="page-wrapper">
          <Nav nav={site.nav} />
          {children}
        </div>
        <Motion pageNames={pageNames} />
      </body>
    </html>
  );
}
