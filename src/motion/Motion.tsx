"use client";

import { useEffect } from "react";

import { startMotion } from "./startMotion";

// Mounted once in the root layout. Renders nothing; it starts the motion layer after
// the server-rendered page has hydrated.
export function Motion({ pageNames }: { pageNames: Record<string, string> }) {
  useEffect(() => {
    startMotion(pageNames);
  }, [pageNames]);

  return null;
}
