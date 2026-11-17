// Pointer effects on desktop. The cursor itself is a CSS cursor (motion.css); these add
// the motion around it: links lean toward the pointer, big cards lift, text lights up.
import { all } from "./env";
import { gsap } from "./gsap";
import { SPOTLIGHT_TEXT } from "./selectors";

type QuickTo = ReturnType<typeof gsap.quickTo>;

const LIFT_AREA = 60_000; // px²: a link bigger than this is a card, so it lifts instead

/** Links and buttons lean a little toward the pointer; card-sized links lift. */
export function setupHoverPull() {
  const pulls = new WeakMap<Element, [QuickTo, QuickTo]>();
  const pullOf = (element: Element) => {
    let pull = pulls.get(element);
    if (!pull) {
      pull = [
        gsap.quickTo(element, "x", { duration: 0.45, ease: "power3" }),
        gsap.quickTo(element, "y", { duration: 0.45, ease: "power3" }),
      ];
      pulls.set(element, pull);
    }
    return pull;
  };

  for (const link of all("a[href], button")) {
    if (link.closest("svg")) {
      continue;
    }
    const { height, width } = link.getBoundingClientRect();
    if (width * height > LIFT_AREA) {
      const lift = (scale: number) =>
        gsap.to(link, {
          duration: 0.6,
          ease: "expo.out",
          overwrite: "auto",
          scale,
        });
      link.addEventListener("mouseenter", () => lift(1.012));
      link.addEventListener("mouseleave", () => lift(1));
      continue;
    }

    link.addEventListener("mousemove", (event) => {
      // Measure without the current pull, so the element does not chase itself.
      const rect = link.getBoundingClientRect();
      const offsetX = Number(gsap.getProperty(link, "x")) || 0;
      const offsetY = Number(gsap.getProperty(link, "y")) || 0;
      const [pullX, pullY] = pullOf(link);
      pullX((event.clientX - (rect.left - offsetX + rect.width / 2)) * 0.1);
      pullY((event.clientY - (rect.top - offsetY + rect.height / 2)) * 0.12);
    });
    link.addEventListener("mouseleave", () => {
      const [pullX, pullY] = pullOf(link);
      pullX(0);
      pullY(0);
    });
  }
}

/** A soft light under the pointer that brightens readable text. */
export function setupSpotlight() {
  if (
    !CSS.supports("background-clip", "text") &&
    !CSS.supports("-webkit-background-clip", "text")
  ) {
    return;
  }
  for (const element of all(SPOTLIGHT_TEXT)) {
    if (element.closest(".about-story, .case-text")) {
      continue;
    }
    element.style.setProperty("--spot-base", getComputedStyle(element).color);
    element.classList.add("fx-spot");
    let frame = 0;
    element.addEventListener("mouseenter", () =>
      element.classList.add("is-lit"),
    );
    element.addEventListener("mouseleave", () =>
      element.classList.remove("is-lit"),
    );
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          element.style.setProperty("--mx", `${x}px`);
          element.style.setProperty("--my", `${y}px`);
        });
      }
    });
  }
}
