// Small DOM helpers shared by the motion modules. No GSAP here, so client components
// can import them cheaply.
import type Lenis from "lenis";

export type MotionContext = {
  /** Fine pointer with hover: the desktop-only effects run. */
  fine: boolean;
  fontsReady: Promise<unknown>;
  isHome: boolean;
  lenis: Lenis | null;
  /** Page titles for the wipe, by pathname. */
  pageNames: Record<string, string>;
};

// Shared with the boot script in Overlays, which reads them before React loads.
export const PAGE_KEY = "motion-page"; // title of the page being opened, set by the wipe
export const VISITED_KEY = "motion-visited"; // the loader already ran this session
export const READY_FLAG = "__motionReady"; // set on window once the motion layer starts

export const prefersReducedMotion = () =>
  globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasFinePointer = () =>
  globalThis.matchMedia("(pointer: fine)").matches &&
  globalThis.matchMedia("(hover: hover)").matches;

export function all<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T[] {
  return [...root.querySelectorAll<T>(selector)];
}

export function createElement(
  className: string,
  text?: string,
): HTMLDivElement {
  const element = document.createElement("div");
  element.className = className;
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

export function one<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): null | T {
  return root.querySelector<T>(selector);
}

export const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** A ScrollTrigger config that fires once, when `trigger` reaches `start`. */
export const onceAt = (trigger: Element | string, start = "top 85%") => ({
  once: true,
  start,
  trigger,
});

// sessionStorage throws in some privacy modes; the motion layer treats that as empty.
export const session = {
  get(key: string) {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  remove(key: string) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Storage unavailable: nothing to remove.
    }
  },
  set(key: string, value: string) {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Storage unavailable: the loader shows again next time, which is harmless.
    }
  },
};

/** Runs one effect; a failure is logged and never stops the others. */
export function safely(name: string, effect: () => void) {
  try {
    effect();
  } catch (error) {
    console.warn(`[motion:${name}]`, error);
  }
}
