// GSAP with its plugins, registered once. Every motion module imports gsap from here.
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(
  ScrollTrigger,
  MotionPathPlugin,
  SplitText,
  ScrambleTextPlugin,
);
// The same effects run on every page, so a selector with no match on this page is normal.
gsap.config({ nullTargetWarn: false });

export { default as gsap } from "gsap";
export { ScrollTrigger } from "gsap/ScrollTrigger";
export { SplitText } from "gsap/SplitText";
