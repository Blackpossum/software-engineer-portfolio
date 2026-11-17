// Pointer details: card tilt, glare, glow and arrow nudges, plus copy-to-clipboard.
import { all, createElement, one } from "./env";
import { gsap } from "./gsap";

type TiltOptions = {
  host?: HTMLElement;
  onLeave?: () => void;
  onMove?: (x: number, y: number, event: MouseEvent) => void;
  perspective?: number;
};

/** Clicking the big email address copies it instead of opening the mail app. */
export function copyEmail() {
  for (const link of all<HTMLAnchorElement>(".contact-email")) {
    link.addEventListener("click", (event) => {
      const email = link.textContent?.trim();
      if (event.metaKey || event.ctrlKey || !navigator.clipboard || !email) {
        return;
      }
      event.preventDefault();
      navigator.clipboard.writeText(email).then(
        () => {
          toast(`Email copied: ${email}`);
          gsap.fromTo(
            link,
            { scale: 0.97 },
            { duration: 0.6, ease: "elastic.out(1, 0.4)", scale: 1 },
          );
        },
        () => {
          globalThis.location.href = link.href;
        },
      );
    });
  }
}

export function pointerInteractions() {
  heroCard();
  workCards();
  cardGlow();
}

/** A soft lime light follows the pointer across cards; their arrows nudge outward. */
function cardGlow() {
  for (const card of all(
    ".repo-card, .skill-card, .stat-card, .contact-card",
  )) {
    card.classList.add("fx-glow");
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--gx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--gy", `${event.clientY - rect.top}px`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--gx", "-999px");
      card.style.setProperty("--gy", "-999px");
    });
    const arrow = one(".repo-arrow, .contact-row-arrow", card);
    if (arrow) {
      onHover(card, arrow, { out: { x: 0, y: 0 }, over: { x: 4, y: -4 } });
    }
  }
  for (const row of all(".contact-row")) {
    const arrow = one(".contact-row-arrow", row);
    if (arrow) {
      onHover(row, arrow, { out: { x: 0 }, over: { x: 6 } });
    }
  }
}

function heroCard() {
  const card = one(".hero-card");
  const visual = one(".hero-visual");
  if (!card || !visual) {
    return;
  }
  const glare = createElement("fx-glare");
  card.append(glare);
  const photo = one(".hero-photo", card);
  const shiftPhoto = photo
    ? gsap.quickTo(photo, "x", { duration: 0.9, ease: "power3" })
    : null;

  tilt(card, 10, {
    host: visual,
    onLeave: () => shiftPhoto?.(0),
    onMove: (x, _y, event) => {
      const rect = card.getBoundingClientRect();
      glare.style.setProperty("--gx", `${event.clientX - rect.left}px`);
      glare.style.setProperty("--gy", `${event.clientY - rect.top}px`);
      shiftPhoto?.(x * -18);
    },
    perspective: 900,
  });
}

/** Tweens `target` while the pointer is over `host`, and back when it leaves. */
function onHover(
  host: Element,
  target: Element,
  { out, over }: { out: gsap.TweenVars; over: gsap.TweenVars },
) {
  const timing = { duration: 0.5, ease: "expo.out" };
  host.addEventListener("mouseenter", () =>
    gsap.to(target, { ...timing, ...over }),
  );
  host.addEventListener("mouseleave", () =>
    gsap.to(target, { ...timing, ...out }),
  );
}

/** Rotates `element` toward the pointer, up to `max` degrees. */
function tilt(element: HTMLElement, max: number, options: TiltOptions = {}) {
  const { host = element, onLeave, onMove, perspective = 1000 } = options;
  gsap.set(element, { transformPerspective: perspective });
  const rotateX = gsap.quickTo(element, "rotationX", {
    duration: 0.7,
    ease: "power3",
  });
  const rotateY = gsap.quickTo(element, "rotationY", {
    duration: 0.7,
    ease: "power3",
  });

  host.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY(x * max);
    rotateX(-y * max);
    onMove?.(x, y, event);
  });
  host.addEventListener("mouseleave", () => {
    rotateY(0);
    rotateX(0);
    onLeave?.();
  });
}

function toast(message: string) {
  let element = one(".fx-toast");
  if (!element) {
    element = createElement("fx-toast");
    document.body.append(element);
  }
  element.setAttribute("role", "status");
  element.textContent = message;
  gsap.killTweensOf(element);
  gsap
    .timeline()
    .to(element, { duration: 0.5, ease: "expo.out", opacity: 1, y: 0 })
    .to(element, { duration: 0.4, ease: "power2.in", opacity: 0, y: 16 }, 2.2);
}

function workCards() {
  for (const card of all(".work-card")) {
    tilt(card, 5);
  }
  for (const card of all(".work-featured")) {
    tilt(card, 2.5, { perspective: 1600 });
  }
  for (const card of all(".work-card, .work-featured")) {
    const art = one("svg", card);
    if (art) {
      onHover(card, art, {
        out: { duration: 0.8, scale: 1 },
        over: { duration: 0.8, scale: 1.05 },
      });
    }
  }
}
