// Apple-style adaptive pointer: a soft grey disc that snaps onto links and buttons,
// turns into an I-beam over text, and lets big cards lift instead of covering them.
import { all, createElement } from "./env";
import { gsap } from "./gsap";
import { SCROLL_READ_TEXT, SPOTLIGHT_TEXT } from "./selectors";

type Mode = "" | "highlight" | "lift" | "text";
type QuickTo = ReturnType<typeof gsap.quickTo>;

const TEXT = `${SPOTLIGHT_TEXT}, ${SCROLL_READ_TEXT}, h1, h2, h3, h4, p, .eyebrow, .mono-label, .case-meta-value`;
const FREE = {
  backgroundColor: "rgba(161,161,161,.45)",
  borderRadius: 10,
  height: 20,
  width: 20,
};
const LIFT_AREA = 60_000; // px²: above this a link is a card, so it lifts instead

export function setupCursor() {
  const cursor = createElement("fx-cursor");
  cursor.setAttribute("aria-hidden", "true");
  document.body.append(cursor);
  document.documentElement.classList.add("has-cursor");
  gsap.set(cursor, { x: -100, xPercent: -50, y: -100, yPercent: -50, ...FREE });

  const moveX = gsap.quickTo(cursor, "x", { duration: 0.16, ease: "power3" });
  const moveY = gsap.quickTo(cursor, "y", { duration: 0.16, ease: "power3" });
  const pulls = new WeakMap<Element, [QuickTo, QuickTo]>();
  let mouseX = -100;
  let mouseY = -100;
  let visible = false;
  let mode: Mode = "";
  let target: HTMLElement | null = null;

  // Highlighted elements lean a little toward the pointer (not SVG parts).
  const pullOf = (element: Element) => {
    if (element.closest("svg")) {
      return null;
    }
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

  const release = () => {
    if (!target) {
      return;
    }
    if (mode === "highlight") {
      const pull = pullOf(target);
      pull?.[0](0);
      pull?.[1](0);
    }
    if (mode === "lift") {
      gsap.to(target, {
        duration: 0.6,
        ease: "expo.out",
        overwrite: "auto",
        scale: 1,
        y: 0,
      });
    }
  };

  const shapeFor = (nextMode: Mode, element: HTMLElement | null) => {
    if (nextMode === "highlight" && element) {
      const rect = element.getBoundingClientRect();
      const round = element.closest("svg");
      const radius = round
        ? 999
        : Math.max(
            Number.parseFloat(getComputedStyle(element).borderTopLeftRadius) ||
              0,
            6,
          ) + 4;
      return {
        backgroundColor: isLightBackground(element)
          ? "rgba(0,0,0,.14)"
          : "rgba(255,255,255,.1)",
        borderRadius: Math.min(radius, (rect.height + 12) / 2),
        duration: 0.35,
        height: rect.height + (round ? 10 : 12),
        width: rect.width + (round ? 10 : 18),
      };
    }
    if (nextMode === "text" && element) {
      const style = getComputedStyle(element);
      const lineHeight =
        Number.parseFloat(style.lineHeight) ||
        Number.parseFloat(style.fontSize) * 1.3 ||
        24;
      return {
        backgroundColor: "rgba(237,237,237,.9)",
        borderRadius: 1,
        duration: 0.25,
        height: Math.max(14, Math.min(lineHeight, 72)),
        width: 2,
      };
    }
    if (nextMode === "lift") {
      return {
        backgroundColor: "rgba(237,237,237,.6)",
        borderRadius: 5,
        duration: 0.3,
        height: 10,
        width: 10,
      };
    }
    return { ...FREE, duration: 0.35 };
  };

  const setMode = (nextMode: Mode, element: HTMLElement | null) => {
    if (nextMode === mode && element === target) {
      return;
    }
    release();
    mode = nextMode;
    target = element;
    gsap.to(cursor, {
      ease: "power3.out",
      opacity: 1,
      overwrite: "auto",
      scale: 1,
      ...shapeFor(nextMode, element),
    });
    if (nextMode === "lift" && element) {
      gsap.to(element, {
        duration: 0.6,
        ease: "expo.out",
        overwrite: "auto",
        scale: 1.012,
      });
    }
  };

  globalThis.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!visible) {
        visible = true;
        gsap.set(cursor, { x: mouseX, y: mouseY });
        gsap.to(cursor, { duration: 0.3, opacity: 1 });
      }
    },
    { passive: true },
  );
  document.documentElement.addEventListener("mouseleave", () => {
    visible = false;
    setMode("", null);
    gsap.to(cursor, { duration: 0.25, opacity: 0 });
  });
  globalThis.addEventListener("mousedown", () => {
    gsap.to(cursor, { duration: 0.15, ease: "power2.out", scale: 0.88 });
  });
  globalThis.addEventListener("mouseup", () => {
    gsap.to(cursor, { duration: 0.45, ease: "back.out(3)", scale: 1 });
  });

  document.addEventListener(
    "mouseover",
    (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }
      const robot = event.target.closest<HTMLElement>(".rv-robot");
      if (robot) {
        setMode("highlight", robot);
        return;
      }
      const link = event.target.closest<HTMLElement>("a[href], button");
      if (link) {
        const { height, width } = link.getBoundingClientRect();
        setMode(width * height > LIFT_AREA ? "lift" : "highlight", link);
        return;
      }
      const text = event.target.closest<HTMLElement>(TEXT);
      setMode(text ? "text" : "", text);
    },
    { passive: true },
  );

  // Every frame: follow the mouse, or sit on the highlighted element with a slight pull.
  gsap.ticker.add(() => {
    if (!visible) {
      return;
    }
    if (mode !== "highlight" || !target?.isConnected) {
      moveX(mouseX);
      moveY(mouseY);
      return;
    }
    const rect = target.getBoundingClientRect();
    const round = target.closest("svg");
    const offsetX = round ? 0 : Number(gsap.getProperty(target, "x")) || 0;
    const offsetY = round ? 0 : Number(gsap.getProperty(target, "y")) || 0;
    const centerX = rect.left - offsetX + rect.width / 2;
    const centerY = rect.top - offsetY + rect.height / 2;
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    moveX(centerX + dx * 0.16);
    moveY(centerY + dy * 0.16);
    const pull = pullOf(target);
    pull?.[0](dx * 0.1);
    pull?.[1](dy * 0.12);
  });
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

function isLightBackground(element: Element) {
  const color = getComputedStyle(element).backgroundColor;
  const [r, g, b, a = 1] = (color.match(/[\d.]+/g) ?? []).map(Number);
  if (b === undefined || a < 0.5) {
    return false;
  }
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.6;
}
