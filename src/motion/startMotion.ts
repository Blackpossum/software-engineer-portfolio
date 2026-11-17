// Starts the motion layer once per page load. Every page is its own document (the wipe
// covers the load), so effects are set up once and never need tearing down.
import type { MotionContext } from "./env";

import {
  hasFinePointer,
  one,
  prefersReducedMotion,
  READY_FLAG,
  safely,
  wait,
} from "./env";
import { ScrollTrigger } from "./gsap";
import { copyEmail, pointerInteractions } from "./interactions";
import { caseIntro, heroIntro } from "./intros";
import { enter, runLoader, setupLinks } from "./pageTransitions";
import { setupHoverPull, setupSpotlight } from "./pointer";
import {
  baseReveals,
  scrambleLabels,
  scrollRead,
  splitHeadings,
} from "./reveals";
import {
  caseScroll,
  heroScrollOut,
  journey,
  marquee,
  navHide,
  scrollSpy,
  workScroll,
} from "./scenes";
import { createSmoothScroll, scrollProgress } from "./smoothScroll";
import { roverFleet, workMinis } from "./visuals";

const CURTAIN_TIMEOUT_MS = 6000;
const FONT_TIMEOUT_MS = 1800;

let started = false;

export function startMotion(pageNames: Record<string, string>) {
  if (started) {
    return; // React may run effects twice in development
  }
  started = true;
  const html = document.documentElement;
  Object.assign(globalThis, { [READY_FLAG]: true });

  if (prefersReducedMotion()) {
    html.classList.remove("js", "is-loading", "is-transition");
    return;
  }

  const context: MotionContext = {
    fine: hasFinePointer(),
    fontsReady: Promise.race([document.fonts.ready, wait(FONT_TIMEOUT_MS)]),
    isHome: one(".hero") !== null,
    lenis: null,
    pageNames,
  };

  // Foundation: runs straight away, under the curtain.
  safely("lenis", () => {
    context.lenis = createSmoothScroll();
  });
  safely("progress", scrollProgress);
  if (context.fine) {
    safely("pull", setupHoverPull);
    safely("spotlight", setupSpotlight);
  }
  safely("links", () => setupLinks(context));
  safely("copy", copyEmail);
  safely("nav", navHide);

  // Page effects: run once the curtain lifts, so intros play in view.
  let revealed = false;
  const revealPage = () => {
    if (revealed) {
      return;
    }
    revealed = true;
    safely("heroIntro", () => heroIntro(context));
    safely("caseIntro", caseIntro);
    safely("reveals", baseReveals);
    safely("journey", journey);
    safely("rover", () => roverFleet(context));
    safely("minis", workMinis);
    safely("split", () => splitHeadings(context));
    safely("read", scrollRead);
    safely("scramble", scrambleLabels);
    safely("marquee", () => marquee(context));
    safely("heroOut", heroScrollOut);
    safely("work", workScroll);
    safely("case", caseScroll);
    safely("spy", () => scrollSpy(context));
    if (context.fine) {
      safely("interactions", pointerInteractions);
    }
    ScrollTrigger.refresh();
  };

  if (html.classList.contains("is-loading")) {
    safely("loader", () => runLoader(context, revealPage));
  } else if (html.classList.contains("is-transition")) {
    safely("enter", () => enter(revealPage));
  } else {
    revealPage();
  }

  // Last resort: never leave a curtain over the page.
  setTimeout(() => {
    if (
      html.classList.contains("is-loading") ||
      html.classList.contains("is-transition")
    ) {
      html.classList.remove("is-loading", "is-transition");
      context.lenis?.start();
      revealPage();
    }
  }, CURTAIN_TIMEOUT_MS);
  globalThis.addEventListener("load", () => ScrollTrigger.refresh());
}
