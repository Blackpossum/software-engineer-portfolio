// Scroll-linked scenes: effects scrubbed by scroll position rather than played once.
import type { MotionContext } from "./env";

import { all, onceAt, one } from "./env";
import { gsap, ScrollTrigger } from "./gsap";

const DESKTOP = "(min-width: 992px)";
const TABLET_DOWN = "(max-width: 991px)";
const ACCENT = "#CCFF33";

/** Case pages: hero visual parallax, popping bullets, and the next title filling with lime. */
export function caseScroll() {
  for (const visual of all(".case-visual")) {
    const inner = visual.firstElementChild;
    if (inner) {
      gsap.fromTo(
        inner,
        { yPercent: -5 },
        {
          ease: "none",
          scrollTrigger: {
            end: "bottom top",
            scrub: true,
            start: "top bottom",
            trigger: visual,
          },
          yPercent: 5,
        },
      );
    }
  }
  for (const list of all(".case-list")) {
    gsap.from(all(".case-bullet", list), {
      duration: 0.5,
      ease: "back.out(3)",
      scale: 0,
      scrollTrigger: onceAt(list, "top 82%"),
      stagger: 0.08,
    });
  }
  for (const next of all(".next-case")) {
    const title = one(".next-title", next);
    if (title) {
      title.classList.add("fx-fill");
      gsap.fromTo(
        title,
        { "--p": "0%" },
        {
          "--p": "100%",
          ease: "none",
          scrollTrigger: {
            end: "center 55%",
            scrub: 0.4,
            start: "top 92%",
            trigger: next,
          },
        },
      );
    }
  }
}

/** On desktop the hero recedes as you scroll past it. */
export function heroScrollOut() {
  if (!one(".hero")) {
    return;
  }
  gsap.matchMedia().add(DESKTOP, () => {
    const scrub = {
      end: "bottom top",
      scrub: true,
      start: "top top",
      trigger: ".hero",
    };
    gsap.to(".hero-content", {
      ease: "none",
      opacity: 0.15,
      scrollTrigger: scrub,
      yPercent: -14,
    });
    gsap.to(".hero-visual", {
      ease: "none",
      rotation: -3,
      scale: 0.92,
      scrollTrigger: { ...scrub },
      y: 90,
    });
  });
}

/** Desktop: the timeline pins and each milestone lights up in turn. Mobile: a vertical fill. */
export function journey() {
  const timeline = one(".timeline");
  const progress = one(".timeline-progress");
  if (!timeline || !progress) {
    return;
  }
  const milestones = all(".milestone", timeline);
  const cards = milestones.map((m) =>
    one(".milestone-card, .milestone-card-now", m),
  );
  const dots = milestones.map((m) =>
    one(".milestone-dot, .milestone-dot-now", m),
  );
  const baseBorders = cards.map((card) =>
    card ? getComputedStyle(card).borderTopColor : "#2E2E2E",
  );
  const media = gsap.matchMedia();

  media.add(DESKTOP, () => {
    gsap.set(progress, { scaleX: 0, scaleY: 1, transformOrigin: "0% 50%" });
    gsap.from(cards, {
      duration: 1,
      ease: "expo.out",
      opacity: 0,
      scrollTrigger: onceAt(timeline),
      stagger: 0.08,
      yPercent: 12,
    });

    const scene = gsap.timeline({
      scrollTrigger: {
        anticipatePin: 1,
        end: `+=${milestones.length * 170}`,
        pin: true,
        scrub: 0.7,
        start: "center 55%",
        trigger: timeline,
      },
    });
    scene.to(
      progress,
      { duration: Math.max(milestones.length - 1, 1), ease: "none", scaleX: 1 },
      0,
    );

    for (const [index, card] of cards.entries()) {
      const dot = dots[index];
      const isLast = index === milestones.length - 1;
      if (dot) {
        scene.to(
          dot,
          {
            backgroundColor: ACCENT,
            borderColor: ACCENT,
            duration: 0.25,
            ease: "back.out(3)",
            scale: 1.45,
          },
          index,
        );
        if (!isLast) {
          scene.to(dot, { duration: 0.25, scale: 1 }, index + 0.75);
        }
      }
      if (card) {
        scene.to(
          card,
          {
            borderColor: "rgba(204,255,51,.6)",
            boxShadow: "0 24px 48px -28px rgba(204,255,51,.45)",
            duration: 0.3,
            ease: "power2.out",
            y: -12,
          },
          index,
        );
        if (!isLast) {
          scene.to(
            card,
            {
              borderColor: baseBorders[index],
              boxShadow: "0 0 0 0 rgba(0,0,0,0)",
              duration: 0.3,
              y: 0,
            },
            index + 0.75,
          );
        }
      }
    }

    return () => {
      gsap.set([...cards, ...dots].filter(Boolean), {
        clearProps: "transform,borderColor,boxShadow,backgroundColor",
      });
    };
  });

  media.add(TABLET_DOWN, () => {
    gsap.fromTo(
      progress,
      { scaleX: 1, scaleY: 0, transformOrigin: "50% 0%" },
      {
        ease: "none",
        scaleY: 1,
        scrollTrigger: {
          end: "bottom 60%",
          scrub: 0.6,
          start: "top 70%",
          trigger: timeline,
        },
      },
    );
    for (const [index, milestone] of milestones.entries()) {
      gsap.from(cards[index], {
        duration: 0.9,
        ease: "expo.out",
        opacity: 0,
        scrollTrigger: onceAt(milestone),
        x: 24,
      });
      const dot = dots[index];
      if (dot) {
        gsap.to(dot, {
          backgroundColor: ACCENT,
          borderColor: ACCENT,
          duration: 0.4,
          ease: "back.out(3)",
          scale: 1.35,
          scrollTrigger: {
            start: "top 62%",
            toggleActions: "play none none reverse",
            trigger: milestone,
          },
        });
      }
    }
  });
}

/** The tech band drifts on its own and speeds up (and skews) with scroll velocity. */
export function marquee(context: MotionContext) {
  const band = one(".fx-marquee");
  const track = one(".fx-marquee-track", band ?? undefined);
  if (!band || !track) {
    return;
  }
  let width = 0;
  let x = 0;
  let velocity = 0;
  let direction = -1;
  let active = false;

  const measure = () => {
    width = (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
  };
  measure();
  void context.fontsReady.then(measure);
  globalThis.addEventListener("resize", measure);

  const setX = gsap.quickSetter(track, "x", "px");
  const setSkew = gsap.quickSetter(track, "skewX", "deg");
  gsap.ticker.add((_time, deltaTime) => {
    if (!active || !width) {
      return;
    }
    const frames = deltaTime / 16.67;
    x += (0.7 + Math.min(Math.abs(velocity) / 35, 22)) * direction * frames;
    x = gsap.utils.wrap(-width, 0, x);
    setX(x);
    setSkew(gsap.utils.clamp(-7, 7, velocity / 120));
    velocity *= Math.pow(0.9, frames);
  });

  ScrollTrigger.create({
    end: "bottom top",
    onToggle: (self) => {
      active = self.isActive;
    },
    onUpdate: (self) => {
      velocity = self.getVelocity() / 10;
      direction = self.direction === 1 ? -1 : 1;
    },
    start: "top bottom",
    trigger: band,
  });
  gsap.from(band, {
    duration: 1,
    opacity: 0,
    scrollTrigger: onceAt(band, "top 95%"),
  });
}

/** The nav slides away while scrolling down and comes back on the way up. */
export function navHide() {
  const nav = one(".nav");
  if (!nav) {
    return;
  }
  let shown = true;
  ScrollTrigger.create({
    end: "max",
    onUpdate: (self) => {
      const menuOpen = one(".nav-menu.is-open") !== null;
      const hide = self.direction === 1 && self.scroll() > 140 && !menuOpen;
      if (hide === shown) {
        shown = !hide;
        gsap.to(nav, {
          duration: 0.45,
          ease: "expo.out",
          yPercent: hide ? -100 : 0,
        });
      }
    },
    start: 0,
  });
}

/** On the home page, the nav link of the section in view gets the lime underline. */
export function scrollSpy(context: MotionContext) {
  if (!context.isHome) {
    return;
  }
  for (const link of all<HTMLAnchorElement>(".nav-link")) {
    const id = link.hash.slice(1);
    const section = id ? one(`#${CSS.escape(id)}`) : null;
    if (section) {
      ScrollTrigger.create({
        end: "bottom 45%",
        onToggle: (self) => link.classList.toggle("is-current", self.isActive),
        start: "top 45%",
        trigger: section,
      });
    }
  }
}

/** The featured work visual grows to full size as it scrolls in. */
export function workScroll() {
  for (const visual of all(".work-featured-visual")) {
    gsap.fromTo(
      visual,
      { borderRadius: 40, scale: 0.9 },
      {
        borderRadius: 0,
        ease: "none",
        scale: 1,
        scrollTrigger: {
          end: "top 45%",
          scrub: true,
          start: "top bottom",
          trigger: visual,
        },
      },
    );
  }
}
