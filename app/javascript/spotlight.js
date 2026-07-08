// Cursor spotlight — a soft light the visitor carries through the exhibition.
// Desktop pointer only; fades in on first movement, out when the pointer leaves.

import { registerInteraction } from "utils/lifecycle";

function init() {
  if (typeof gsap === "undefined") return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  if (!window.matchMedia("(pointer: fine)").matches) return null;

  const spotlight = document.querySelector("[data-spotlight]");
  if (!spotlight) return null;

  gsap.set(spotlight, { xPercent: -50, yPercent: -50 });

  const xTo = gsap.quickTo(spotlight, "x", { duration: 0.9, ease: "power3.out" });
  const yTo = gsap.quickTo(spotlight, "y", { duration: 0.9, ease: "power3.out" });

  let visible = false;

  const onMove = (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    if (!visible) {
      visible = true;
      gsap.to(spotlight, { opacity: 1, duration: 0.8, ease: "power2.out" });
    }
  };

  const onLeave = () => {
    visible = false;
    gsap.to(spotlight, { opacity: 0, duration: 0.4, ease: "power2.out" });
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  document.documentElement.addEventListener("mouseleave", onLeave);

  return () => {
    window.removeEventListener("mousemove", onMove);
    document.documentElement.removeEventListener("mouseleave", onLeave);
    gsap.set(spotlight, { clearProps: "all" });
  };
}

registerInteraction(init);

export { init };
