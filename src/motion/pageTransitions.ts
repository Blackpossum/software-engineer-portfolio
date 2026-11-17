// The loader (first visit of a session) and the wipe between pages. Pages are separate
// documents: the wipe covers the screen, the browser loads the next page, and the new
// page lifts the same curtain on load (the boot script in Overlays shows it pre-paint).
import type { MotionContext } from "./env";

import { all, one, PAGE_KEY, session, VISITED_KEY, wait } from "./env";
import { gsap } from "./gsap";
import { scrollToTarget } from "./smoothScroll";

const NAV_FALLBACK_MS = 1600;

let leaving = false;

const html = () => document.documentElement;
/** Lifts the wipe that the previous page left over this one. */
export function enter(done: () => void) {
  const { accent, label, panel, sub } = wipeParts();
  if (label) {
    label.textContent = session.get(PAGE_KEY);
  }
  session.remove(PAGE_KEY);
  gsap
    .timeline({
      onComplete: () => {
        html().classList.remove("is-transition");
        gsap.set([accent, panel, label], { clearProps: "transform" });
      },
    })
    .from(label, { duration: 0.5, ease: "expo.out", yPercent: 110 }, 0)
    .to(label, { duration: 0.45, ease: "power3.in", yPercent: -110 }, 0.45)
    .to(sub, { duration: 0.2, opacity: 0 }, 0.45)
    .to(panel, { duration: 0.85, ease: "power3.inOut", yPercent: -100 }, 0.6)
    .to(accent, { duration: 0.85, ease: "power3.inOut", yPercent: -100 }, 0.72)
    .add(done, 1);
}

/** Counts to 100 and types the name while the page loads, then slides away. */
export function runLoader(context: MotionContext, done: () => void) {
  session.set(VISITED_KEY, "1");
  const loader = one(".fx-loader");
  const count = one(".fx-count");
  const bar = one(".fx-loader-bar");
  const type = one(".fx-type");
  if (!loader || !count || !type) {
    html().classList.remove("is-loading");
    done();
    return;
  }

  const word = "yosaphat";
  const progress = { value: 0 };
  const typing = { value: 0 };
  const chrome = all(".fx-loader-top > *, .fx-loader-bottom .fx-mono", loader);
  const render = () => {
    count.textContent = String(Math.round(progress.value)).padStart(2, "0");
  };

  context.lenis?.stop();
  const intro = gsap
    .timeline()
    .from(
      chrome,
      { duration: 0.6, ease: "expo.out", opacity: 0, stagger: 0.08, y: 14 },
      0,
    )
    .from(count, { duration: 0.8, ease: "expo.out", yPercent: 100 }, 0.1)
    .to(
      typing,
      {
        duration: 0.55,
        ease: "none",
        onUpdate: () => {
          type.textContent = word.slice(
            0,
            Math.round(typing.value * word.length),
          );
        },
        value: 1,
      },
      0.15,
    )
    .to(
      progress,
      { duration: 1.05, ease: "power2.inOut", onUpdate: render, value: 86 },
      0.1,
    )
    .to(bar, { duration: 1.05, ease: "power2.inOut", scaleX: 0.86 }, 0.1);

  const pageLoaded = new Promise<void>((resolve) => {
    if (document.readyState === "complete") {
      resolve();
    } else {
      globalThis.addEventListener("load", () => resolve(), { once: true });
    }
  });
  const ready = Promise.race([
    Promise.all([context.fontsReady, pageLoaded]),
    wait(1300),
  ]);

  void Promise.all([intro.then(), ready]).then(() => {
    gsap
      .timeline({
        onComplete: () => {
          html().classList.remove("is-loading");
          context.lenis?.start();
        },
      })
      .to(
        progress,
        { duration: 0.35, ease: "power2.out", onUpdate: render, value: 100 },
        0,
      )
      .to(bar, { duration: 0.35, ease: "power2.out", scaleX: 1 }, 0)
      .to(count, { duration: 0.5, ease: "power3.in", yPercent: -100 }, 0.4)
      .to(
        chrome,
        { duration: 0.4, ease: "power3.in", opacity: 0, stagger: 0.04, y: -14 },
        0.4,
      )
      .to(
        ".fx-loader-panel",
        { duration: 0.9, ease: "expo.inOut", yPercent: -100 },
        0.7,
      )
      .to(
        ".fx-loader-accent",
        { duration: 0.9, ease: "expo.inOut", yPercent: -100 },
        0.82,
      )
      .add(done, 1.15);
  });
}

/**
 * One click handler for the whole site: anchors on the same page scroll smoothly,
 * links to other pages play the wipe first.
 */
export function setupLinks(context: MotionContext) {
  document.addEventListener(
    "click",
    (event) => {
      const hit = linkFromClick(event);
      if (!hit) {
        return;
      }
      const { link, url } = hit;
      const samePage =
        cleanPath(url.pathname) === cleanPath(globalThis.location.pathname);

      if (samePage) {
        const id = decodeURIComponent(url.hash.slice(1));
        const target = id ? one(`#${CSS.escape(id)}`) : 0;
        if (target === null) {
          return;
        }
        event.preventDefault();
        scrollToTarget(context.lenis, target);
        if (id) {
          history.replaceState(null, "", `#${id}`);
        }
        return;
      }

      event.preventDefault();
      const name =
        context.pageNames[cleanPath(url.pathname)] ??
        (link.textContent?.trim().slice(0, 40) || "Loading");
      leave(context, url.href, name);
    },
    true,
  );

  // Coming back through the history cache restores this page with the wipe still on.
  globalThis.addEventListener("pageshow", (event) => {
    if (!event.persisted) {
      return;
    }
    leaving = false;
    session.remove(PAGE_KEY);
    html().classList.remove("is-transition", "is-loading");
    const { accent, label, panel, wipe } = wipeParts();
    wipe?.classList.remove("is-on");
    gsap.set([accent, panel, label], { clearProps: "all" });
    context.lenis?.start();
  });
}

/** "/work/rover/" and "/work/rover" are the same page. */
function cleanPath(path: string) {
  let clean = path;
  while (clean.length > 1 && clean.endsWith("/")) {
    clean = clean.slice(0, -1);
  }
  return clean;
}

/** Covers the screen with the wipe, then loads `url`. */
function leave(context: MotionContext, url: string, name: string) {
  if (leaving) {
    return;
  }
  leaving = true;
  const { accent, label, panel, sub, wipe } = wipeParts();
  session.set(PAGE_KEY, name);
  if (!wipe || !label) {
    globalThis.location.href = url;
    return;
  }
  context.lenis?.stop();
  label.textContent = name;
  wipe.classList.add("is-on");

  const go = () => {
    globalThis.location.href = url;
  };
  setTimeout(go, NAV_FALLBACK_MS); // in case the timeline is throttled in a background tab
  gsap
    .timeline({ onComplete: go })
    .set([accent, panel], { yPercent: 100 })
    .set(label, { yPercent: 110 })
    .set(sub, { opacity: 0 })
    .to(accent, { duration: 0.55, ease: "power3.inOut", yPercent: 0 })
    .to(panel, { duration: 0.6, ease: "power3.inOut", yPercent: 0 }, 0.1)
    .to(label, { duration: 0.6, ease: "expo.out", yPercent: 0 }, 0.45)
    .to(sub, { duration: 0.3, opacity: 1 }, 0.55);
}

function linkFromClick(event: MouseEvent) {
  const modified =
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  if (event.defaultPrevented || event.button !== 0 || modified) {
    return null;
  }
  const link =
    event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!(link instanceof HTMLAnchorElement)) {
    return null;
  }
  const skip =
    link.target === "_blank" ||
    link.hasAttribute("download") ||
    link.classList.contains("contact-email") ||
    /^(mailto:|tel:)/i.test(link.getAttribute("href") ?? "");
  const url = new URL(link.href, globalThis.location.href);
  return skip || url.origin !== globalThis.location.origin
    ? null
    : { link, url };
}

function wipeParts() {
  return {
    accent: one(".fx-wipe-accent"),
    label: one(".fx-wipe-label"),
    panel: one(".fx-wipe-panel"),
    sub: one(".fx-wipe-sub"),
    wipe: one(".fx-wipe"),
  };
}
