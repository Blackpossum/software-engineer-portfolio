// Entrance timelines for the home hero and the case study hero. They run once the
// loader or wipe has lifted, then drop the `js` class that held the starting states.
import type { MotionContext } from "./env";

import { one, safely } from "./env";
import { gsap, SplitText } from "./gsap";

const doneWithIntro = () => document.documentElement.classList.remove("js");

export function caseIntro() {
  if (!one(".case-hero")) {
    return;
  }
  gsap
    .timeline({ defaults: { ease: "power4.out" }, onComplete: doneWithIntro })
    .to(".case-hero .line", { duration: 1, stagger: 0.1, y: 0 }, 0.1)
    .from(
      ".case-hero .case-back, .case-hero .eyebrow",
      { duration: 0.6, opacity: 0, stagger: 0.08, y: 12 },
      0,
    )
    .from(
      ".case-hero .case-lead, .case-meta-item",
      { duration: 0.7, opacity: 0, stagger: 0.06, y: 18 },
      0.5,
    )
    .from(
      ".case-visual",
      {
        clipPath: "inset(100% 0% 0% 0% round 24px)",
        duration: 1.2,
        ease: "expo.inOut",
      },
      0.4,
    );
}

export function heroIntro(context: MotionContext) {
  if (!one(".hero")) {
    return;
  }
  gsap.set(".hero-photo", { x: 0, xPercent: -50 });
  const timeline = gsap.timeline({
    defaults: { ease: "power4.out" },
    onComplete: () => {
      doneWithIntro();
      if (context.fine) {
        safely("move", jiggleAccentWord);
      }
    },
  });

  timeline
    .to(
      ".hero-card",
      {
        clipPath: "inset(0% 0% 0% 0% round 28px)",
        duration: 1.2,
        ease: "expo.inOut",
      },
      0.1,
    )
    .from(
      ".hero-photo",
      { duration: 1.4, ease: "expo.out", scale: 1.08, yPercent: 14 },
      0.55,
    )
    .to(".hero .line", { duration: 1.05, stagger: 0.12, y: 0 }, 0.35)
    .to(".hero-intro", { duration: 0.8, opacity: 1 }, 0.85)
    .from(".hero-intro", { duration: 0.8, y: 20 }, 0.85)
    .to(".hero-actions", { duration: 0.6, opacity: 1 }, 1)
    // fromTo, not from: the buttons must always end at rest, even if something else
    // touched their transform before this tween recorded its end values.
    .fromTo(
      ".hero-actions > *",
      { opacity: 0, y: 16 },
      { duration: 0.6, opacity: 1, stagger: 0.08, y: 0 },
      1,
    )
    .to(
      ".hero-stack, .hero-card-code, .hero-location",
      { duration: 0.8, opacity: 1, stagger: 0.1 },
      1.15,
    );

  const stack = one(".hero-stack");
  if (stack) {
    timeline.to(
      stack,
      {
        duration: 1.1,
        ease: "none",
        scrambleText: {
          chars: "01/_<>",
          revealDelay: 0.2,
          speed: 0.6,
          text: stack.textContent ?? "",
        },
      },
      1.15,
    );
  }

  gsap.to(".hero-photo", {
    ease: "none",
    scrollTrigger: {
      end: "bottom top",
      scrub: true,
      start: "top top",
      trigger: ".hero",
    },
    yPercent: 8,
  });
}

/** The accent word in the hero ("move.") wobbles letter by letter on hover. */
function jiggleAccentWord() {
  const line = one(".hero .line.text-accent");
  const mask = line?.parentElement;
  if (!line || !mask) {
    return;
  }
  gsap.set(mask, { overflow: "visible" });
  const { chars } = SplitText.create(line, { type: "chars" });
  let busy = false;

  mask.addEventListener("mouseenter", () => {
    if (busy) {
      return;
    }
    busy = true;
    gsap
      .timeline({ onComplete: () => (busy = false) })
      .to(chars, {
        duration: 0.22,
        ease: "power2.out",
        rotate: (index: number) => (index % 2 ? 8 : -8),
        stagger: 0.04,
        y: -18,
      })
      .to(
        chars,
        {
          duration: 0.7,
          ease: "elastic.out(1, 0.35)",
          rotate: 0,
          stagger: 0.04,
          y: 0,
        },
        0.18,
      );
  });
}
