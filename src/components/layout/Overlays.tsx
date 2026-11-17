import type { Site } from "@/content/schema";

import { PAGE_KEY, READY_FLAG, VISITED_KEY } from "@/motion/env";

/** Goes in <head>, so the right curtain is up before anything paints. */
export function BootScript() {
  return <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />;
}

// The first-visit loader and the page wipe. Both stay hidden until BootScript adds
// `is-loading` or `is-transition` to <html>, before the first paint.
export function Overlays({ meta }: { meta: Site["meta"] }) {
  return (
    <>
      <div aria-hidden="true" className="fx-grain" />
      <div aria-hidden="true" className="fx-loader">
        <div className="fx-loader-accent" />
        <div className="fx-loader-panel">
          <div className="fx-loader-top">
            <span className="fx-logo">
              <b>~/</b>
              <span className="fx-type" />
              <i className="fx-caret" />
            </span>
            <span className="fx-mono" style={{ textAlign: "right" }}>
              {meta.role}
              <br />
              {meta.location}
            </span>
          </div>
          <div className="fx-loader-bottom">
            <span className="fx-mono">
              Loading portfolio
              <br />
              Edition 2026
            </span>
            <span className="fx-count-wrap">
              <span className="fx-count">00</span>
            </span>
          </div>
          <div className="fx-loader-bar" />
        </div>
      </div>
      <div aria-hidden="true" className="fx-wipe">
        <div className="fx-wipe-accent" />
        <div className="fx-wipe-panel">
          <span className="fx-logo">
            <b>~/</b>
            {meta.shortName}
          </span>
          <div className="fx-wipe-bottom">
            <span className="fx-wipe-title">
              <span className="fx-wipe-label" />
            </span>
            <span className="fx-mono fx-wipe-sub">Opening</span>
          </div>
        </div>
      </div>
    </>
  );
}

// Runs before React. Picks the curtain for this page load: the loader on the first visit
// of a session, the wipe after an internal link, nothing otherwise. If the motion layer
// never starts, everything is shown after 5 seconds.
const BOOT_SCRIPT = `(function(){
var h=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
h.classList.add('js');
function get(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
if(!reduce){var name=get('${PAGE_KEY}');
if(name){h.classList.add('is-transition')}
else if(!get('${VISITED_KEY}')){h.classList.add('is-loading')}}
setTimeout(function(){if(!window.${READY_FLAG})h.classList.remove('js','is-loading','is-transition')},5000);
})();`;
