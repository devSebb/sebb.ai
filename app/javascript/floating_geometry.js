// Floating geometry manager — persistent background depth layer
// Parallax on scroll + subtle cursor response

import { registerInteraction } from "utils/lifecycle";

function init() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  const geos = document.querySelectorAll(".floating-geo");
  if (!geos.length) return null;

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const cleanups = [];

  const ctx = gsap.context(() => {
    geos.forEach((el) => {
      const speed = parseFloat(el.dataset.speed || "0.3");

      // Scroll parallax
      gsap.to(el, {
        y: () => -(window.innerHeight * speed),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Cursor response (desktop only)
      if (!isMobile) {
        const cursorWeight = parseFloat(el.dataset.cursorWeight || "0.02");
        const xTo = gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" });

        const onMove = (e) => {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          xTo((e.clientX - centerX) * cursorWeight);
          yTo((e.clientY - centerY) * cursorWeight);
        };

        window.addEventListener("mousemove", onMove);
        cleanups.push(() => window.removeEventListener("mousemove", onMove));
      }
    });
  });

  return () => {
    cleanups.forEach((remove) => remove());
    ctx.revert();
  };
}

registerInteraction(init);

export { init };
