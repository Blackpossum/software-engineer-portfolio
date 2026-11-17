import Lenis from "lenis";

import { gsap, ScrollTrigger } from "./gsap";

const NAV_OFFSET = 24;
const expoOut = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Lenis smooth scroll, driven by GSAP's ticker so there is a single animation loop. */
export function createSmoothScroll(): Lenis {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** The thin lime bar at the top that tracks scroll progress. */
export function scrollProgress() {
  const bar = document.createElement("div");
  bar.className = "fx-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.append(bar);
  gsap.to(bar, {
    ease: "none",
    scaleX: 1,
    scrollTrigger: { end: "max", scrub: 0.3, start: 0 },
  });
}

/** Scrolls to an element (below the nav), or to the top when `target` is 0. */
export function scrollToTarget(lenis: Lenis | null, target: 0 | HTMLElement) {
  if (lenis) {
    lenis.scrollTo(target, {
      duration: 1.4,
      easing: expoOut,
      offset: target === 0 ? 0 : -NAV_OFFSET,
    });
  } else if (target === 0) {
    globalThis.scrollTo({ behavior: "smooth", top: 0 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}
