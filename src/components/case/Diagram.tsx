"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/motion/env";

// Where each looping diagram reads best as a still frame (seconds into its animation).
// Used when the visitor prefers reduced motion.
const STILL_FRAME: Record<string, number> = {
  "commonui-diagram-docs-tests": 5.85,
  "commonui-diagram-notifications": 5.25,
  "commonui-diagram-otp-login": 5.6,
  "commonui-diagram-treeview": 4.62,
  "ess-diagram-consumer-to-maintainer": 7.6,
  "ess-diagram-dashboards": 5.6,
  "ess-diagram-messages": 5.95,
  "ess-diagram-question-rules": 5.6,
  "parish-diagram-double-booking-guard": 4.9,
  "parish-diagram-live-display": 3.6,
  "parish-diagram-parish-timezone": 6.4,
  "parish-diagram-push-notifications": 6.4,
  "promptomat-diagram-access-redirect": 5.2,
  "promptomat-diagram-reset-race": 4.875,
  "promptomat-diagram-streak": 6.8,
  "promptomat-diagram-training-hub": 5.2,
  "rover-diagram-cabinet-import": 5.6,
  "rover-diagram-connection": 3.8,
  "rover-diagram-v4-v6": 4.2,
};

const nameOf = (src: string) => src.split("/").pop()?.replace(".svg", "") ?? "";

// An SVG that loops with <animate>. It only plays while on screen, and holds a still
// frame for reduced motion.
export function Diagram({ markup, src }: { markup: string; src: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = ref.current?.querySelector("svg");
    if (!svg) {
      return;
    }
    svg.pauseAnimations();

    if (prefersReducedMotion()) {
      svg.setCurrentTime(STILL_FRAME[nameOf(src)] ?? 0);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          svg.unpauseAnimations();
        } else {
          svg.pauseAnimations();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div className="w-embed">
      <div
        className="rdg"
        dangerouslySetInnerHTML={{ __html: markup }}
        ref={ref}
      />
    </div>
  );
}
