// Scroll-triggered reveals: content fades and rises in as it enters the viewport.
import type { MotionContext } from "./env";

import { all, onceAt, one } from "./env";
import { gsap, ScrollTrigger, SplitText } from "./gsap";
import { SCROLL_READ_TEXT } from "./selectors";

type StaggerOptions = {
  distance?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
  start?: string;
};

export function baseReveals() {
  for (const eyebrow of all(".eyebrow")) {
    if (!eyebrow.closest(".hero, .case-hero")) {
      gsap.from(eyebrow, {
        duration: 0.6,
        ease: "power3.out",
        opacity: 0,
        scrollTrigger: onceAt(eyebrow, "top 90%"),
        x: -14,
      });
    }
  }

  staggerIn(".stats-grid", ".stat-card");
  staggerIn(".skills-grid", ".skill-card", { stagger: 0.12 });
  staggerIn(".skill-card", ".chip, .chip-accent", {
    distance: 12,
    duration: 0.5,
    stagger: 0.03,
    start: "top 75%",
  });
  staggerIn(".skills-extra", ".extra-row", { distance: 16 });
  staggerIn(".work-grid", ".work-card", {
    duration: 1.1,
    ease: "expo.out",
    stagger: 0.12,
  });
  staggerIn(".repo-grid", ".repo-card", {
    duration: 1,
    ease: "expo.out",
    stagger: 0.08,
  });
  staggerIn(
    ".contact-main",
    ".contact-intro, .contact-email, .contact-actions",
    { distance: 24 },
  );
  staggerIn(".case-list", "li", { distance: 20, stagger: 0.08 });
  staggerIn(".case-grid", ".case-block", { distance: 30 });
  riseIn(
    ".work-featured, .callout, .contact-card, .impact-box, .next-case",
    50,
  );

  revealAboutPhoto();
  countUpStats();
}

/** Small mono labels decode from random characters when they come into view. */
export function scrambleLabels() {
  const labels = all(
    ".eyebrow, .case-label, .work-kicker, .callout-date, .impact-label, .next-label, .section-meta, .case-meta-label",
  );
  for (const label of labels) {
    if (label.closest(".hero") || label.children.length > 0) {
      continue;
    }
    const text = label.textContent ?? "";
    ScrollTrigger.create({
      once: true,
      onEnter: () => {
        gsap.to(label, {
          duration: 0.9,
          ease: "none",
          scrambleText: {
            chars: "01/_<>#+",
            revealDelay: 0.25,
            speed: 0.7,
            text,
          },
        });
      },
      start: "top 92%",
      trigger: label,
    });
  }
}

/** Long paragraphs brighten word by word as you scroll through them. */
export function scrollRead() {
  for (const paragraph of all(SCROLL_READ_TEXT)) {
    const { words } = SplitText.create(paragraph, {
      type: "words",
      wordsClass: "fx-w",
    });
    gsap.fromTo(
      words,
      { opacity: 0.14 },
      {
        ease: "none",
        opacity: 1,
        scrollTrigger: {
          end: "bottom 55%",
          scrub: 0.5,
          start: "top 85%",
          trigger: paragraph,
        },
        stagger: 0.1,
      },
    );
  }
}

/** Section headings rise word by word from behind a line mask. */
export function splitHeadings(context: MotionContext) {
  const headings = all(
    ".section .heading-l, .case-section .heading-l, .heading-contact",
  );
  gsap.set(headings, { opacity: 0 });

  void context.fontsReady.then(() => {
    for (const heading of headings) {
      const split = SplitText.create(heading, {
        mask: "lines",
        type: "lines,words",
      });
      gsap.set(heading, { opacity: 1 });
      gsap.from(split.words, {
        duration: 1.1,
        ease: "expo.out",
        onComplete: () => split.revert(),
        rotate: 4,
        scrollTrigger: onceAt(heading, "top 86%"),
        stagger: 0.04,
        yPercent: 115,
      });
    }
    ScrollTrigger.refresh();
  });
}

function countUpStats() {
  for (const element of all(".stat-number[data-count]")) {
    const end = Number(element.dataset.count) || 0;
    const suffix = element.dataset.suffix ?? "";
    const counter = { value: 0 };
    element.textContent = `0${suffix}`;
    gsap.to(counter, {
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = `${Math.round(counter.value)}${suffix}`;
      },
      scrollTrigger: onceAt(element, "top 92%"),
      value: end,
    });
  }
}

function revealAboutPhoto() {
  const wrap = one(".about-photo-wrap");
  if (!wrap) {
    return;
  }
  gsap.fromTo(
    wrap,
    { clipPath: "inset(0% 0% 100% 0% round 24px)" },
    {
      clipPath: "inset(0% 0% 0% 0% round 24px)",
      duration: 1.3,
      ease: "expo.inOut",
      scrollTrigger: onceAt(wrap, "top 80%"),
    },
  );
  const image = one("img", wrap);
  if (image) {
    gsap.fromTo(
      image,
      { scale: 1.3 },
      {
        duration: 1.8,
        ease: "expo.out",
        scale: 1.14,
        scrollTrigger: onceAt(wrap, "top 80%"),
      },
    );
    gsap.fromTo(
      image,
      { yPercent: -5 },
      {
        ease: "none",
        scrollTrigger: {
          end: "bottom top",
          scrub: true,
          start: "top bottom",
          trigger: wrap,
        },
        yPercent: 5,
      },
    );
  }
}

/** Fades and lifts each matching element on its own. */
function riseIn(selector: string, distance: number) {
  for (const element of all(selector)) {
    gsap.from(element, {
      duration: 1,
      ease: "power3.out",
      opacity: 0,
      scrollTrigger: onceAt(element),
      y: distance,
    });
  }
}

/** Each `container` reveals its `items` in a stagger when it scrolls into view. */
function staggerIn(
  container: string,
  items: string,
  options: StaggerOptions = {},
) {
  const {
    distance = 48,
    duration = 0.9,
    ease = "power3.out",
    stagger = 0.1,
    start = "top 82%",
  } = options;
  for (const element of all(container)) {
    const targets = all(items, element);
    if (targets.length > 0) {
      gsap.from(targets, {
        duration,
        ease,
        opacity: 0,
        scrollTrigger: onceAt(element, start),
        stagger,
        y: distance,
      });
    }
  }
}
