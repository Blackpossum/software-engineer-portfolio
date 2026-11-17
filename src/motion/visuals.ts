// The animated illustrations: the Rover fleet map and the four work-card minis.
import type { MotionContext } from "./env";

import { all, onceAt } from "./env";
import { gsap, ScrollTrigger } from "./gsap";

const SVG_NS = "https://www.w3.org/2000/svg";
const ROBOT_STATUS = [
  "RV-01 · en route",
  "RV-02 · en route",
  "RV-03 · rerouting",
];
const MAP_WIDTH = 600;

/** Robots drive their routes, routes flow and the conflict ring pulses, only while on screen. */
export function roverFleet(context: MotionContext) {
  for (const svg of all<SVGSVGElement>(".rover-svg")) {
    const robots = all<SVGGElement>(".rv-robot", svg);
    const robotLoops = robots.map((robot, index) => {
      const path = svg.querySelector<SVGPathElement>(robot.dataset.path ?? "");
      robot.removeAttribute("transform");
      return path
        ? gsap.to(robot, {
            duration: 6 + index * 1.6,
            ease: "sine.inOut",
            motionPath: { path },
            paused: true,
            repeat: -1,
            yoyo: true,
          })
        : null;
    });
    const loops = [
      ...robotLoops.filter((loop) => loop !== null),
      gsap.to(all(".rv-route", svg), {
        duration: 1.2,
        ease: "none",
        paused: true,
        repeat: -1,
        strokeDashoffset: -24,
      }),
      gsap.to(all(".rv-conflict-ring", svg), {
        attr: { r: 22 },
        duration: 0.9,
        ease: "sine.inOut",
        opacity: 0.35,
        paused: true,
        repeat: -1,
        yoyo: true,
      }),
      gsap.to(all(".rv-live", svg), {
        duration: 0.7,
        opacity: 0.15,
        paused: true,
        repeat: -1,
        yoyo: true,
      }),
      gsap.to(all(".rv-robot-idle", svg), {
        duration: 1.4,
        opacity: 0.55,
        paused: true,
        repeat: -1,
        stagger: 0.5,
        yoyo: true,
      }),
    ];

    ScrollTrigger.create({
      end: "bottom top",
      onToggle: (self) => {
        for (const loop of loops) {
          if (self.isActive) {
            loop.play();
          } else {
            loop.pause();
          }
        }
      },
      start: "top bottom",
      trigger: svg,
    });
    gsap.from(all(".rv-zone, .rv-box", svg), {
      duration: 0.7,
      ease: "power3.out",
      opacity: 0,
      scrollTrigger: onceAt(svg, "top 80%"),
      stagger: 0.06,
      y: 12,
    });
    gsap.from(all(".rv-route", svg), {
      attr: { "stroke-dashoffset": 400 },
      duration: 1.4,
      ease: "expo.out",
      opacity: 0,
      scrollTrigger: onceAt(svg, "top 80%"),
      stagger: 0.15,
    });

    if (context.fine) {
      fleetHover(svg, robots, robotLoops);
    }
  }
}

/** The small illustrations on the work cards. */
export function workMinis() {
  for (const svg of all(".viz-platform")) {
    gsap.from(all(".viz-item", svg), {
      duration: 0.5,
      ease: "power2.out",
      opacity: 0,
      scrollTrigger: onceAt(svg),
      stagger: 0.04,
      y: 10,
    });
    gsap.to(all(".viz-toggle", svg), {
      attr: { cx: 254 },
      duration: 0.6,
      ease: "power2.inOut",
      repeat: -1,
      repeatDelay: 1.2,
      yoyo: true,
    });
  }
  for (const svg of all(".viz-streak")) {
    gsap.from(all(".viz-cell", svg), {
      duration: 0.4,
      ease: "back.out(2)",
      scale: 0,
      scrollTrigger: onceAt(svg),
      stagger: 0.05,
      transformOrigin: "50% 50%",
    });
  }
  for (const svg of all(".viz-arch")) {
    const lines = all<SVGPathElement>(".viz-line", svg);
    for (const line of lines) {
      const length = line.getTotalLength();
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
    }
    gsap.to(lines, {
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: onceAt(svg),
      stagger: 0.12,
      strokeDashoffset: 0,
    });
    gsap.to(all(".viz-pulse", svg), {
      duration: 0.9,
      ease: "sine.inOut",
      opacity: 0.3,
      repeat: -1,
      scale: 1.8,
      transformOrigin: "50% 50%",
      yoyo: true,
    });
  }
  for (const svg of all(".viz-code")) {
    gsap.from(all(".viz-codeline", svg), {
      duration: 0.45,
      ease: "power2.out",
      scaleX: 0,
      scrollTrigger: onceAt(svg),
      stagger: 0.08,
      transformOrigin: "0% 50%",
    });
    gsap.from(all(".viz-btn", svg), {
      delay: 0.7,
      duration: 0.4,
      ease: "back.out(2)",
      opacity: 0,
      scale: 0.8,
      scrollTrigger: onceAt(svg),
      stagger: 0.1,
      transformOrigin: "50% 50%",
    });
  }
}

/** Zones light up; a hovered robot stops and reports its status in a tooltip. */
function fleetHover(
  svg: SVGSVGElement,
  robots: SVGGElement[],
  loops: (gsap.core.Tween | null)[],
) {
  for (const zone of all(".rv-zone", svg)) {
    zone.addEventListener("mouseenter", () =>
      gsap.to(zone, { attr: { "fill-opacity": 0.26 }, duration: 0.35 }),
    );
    zone.addEventListener("mouseleave", () =>
      gsap.to(zone, { attr: { "fill-opacity": 0.08 }, duration: 0.5 }),
    );
  }

  const tip = svgElement("g", { class: "rv-tip", opacity: "0" });
  const background = svgElement("rect", {
    fill: "#CCFF33",
    height: "24",
    rx: "6",
  });
  const label = svgElement("text", {
    fill: "#000000",
    "font-family": "JetBrains Mono, monospace",
    "font-size": "11",
    "font-weight": "600",
    x: "10",
    y: "16",
  }) as SVGTextElement;
  tip.append(background, label);
  svg.append(tip);

  for (const [index, robot] of robots.entries()) {
    const loop = loops[index];
    const halo = robot.querySelector("circle");

    robot.addEventListener("mouseenter", () => {
      if (loop) {
        gsap.to(loop, { duration: 0.4, ease: "power2.out", timeScale: 0 });
      }
      if (halo) {
        gsap.to(halo, { attr: { r: 20 }, duration: 0.4, ease: "back.out(3)" });
      }
      label.textContent = ROBOT_STATUS[index] ?? `RV-0${index + 1}`;
      const width = label.getComputedTextLength() + 20;
      background.setAttribute("width", String(width));
      const x = Number(gsap.getProperty(robot, "x"));
      const y = Number(gsap.getProperty(robot, "y"));
      gsap.set(tip, {
        x: Math.min(Math.max(x - width / 2, 8), MAP_WIDTH - 8 - width),
      });
      gsap.fromTo(
        tip,
        { opacity: 0, y: y - 38 },
        { duration: 0.35, ease: "expo.out", opacity: 1, y: y - 46 },
      );
    });
    robot.addEventListener("mouseleave", () => {
      if (loop) {
        gsap.to(loop, { duration: 0.6, ease: "power2.in", timeScale: 1 });
      }
      if (halo) {
        gsap.to(halo, { attr: { r: 13 }, duration: 0.4 });
      }
      gsap.to(tip, { duration: 0.25, opacity: 0 });
    });
  }
}

function svgElement(tag: string, attributes: Record<string, string>) {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  return element;
}
