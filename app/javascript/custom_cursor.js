// Custom cursor — dot + ring + particle trail
// Hidden on touch/mobile via CSS

import { registerInteraction } from "utils/lifecycle";

function init() {
  if (typeof gsap === "undefined") return null;
  if (window.matchMedia("(pointer: coarse)").matches) return null;

  const dot = document.querySelector("[data-cursor='dot']");
  const ring = document.querySelector("[data-cursor='ring']");
  const label = document.querySelector("[data-cursor-label]");
  const particles = document.querySelectorAll("[data-cursor-particle]");
  if (!dot || !ring) return null;

  // Track every listener we bind so teardown can remove them and nothing
  // leaks across Turbo navigations.
  const cleanups = [];
  function on(target, type, handler) {
    target.addEventListener(type, handler);
    cleanups.push(() => target.removeEventListener(type, handler));
  }

  // quickTo for smooth 60fps tracking
  const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
  const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
  const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
  const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });
  const labelX = label ? gsap.quickTo(label, "x", { duration: 0.35, ease: "power3" }) : null;
  const labelY = label ? gsap.quickTo(label, "y", { duration: 0.35, ease: "power3" }) : null;

  let idleTimeout;

  function onMouseMove(e) {
    dotX(e.clientX);
    dotY(e.clientY);
    ringX(e.clientX);
    ringY(e.clientY);
    if (labelX) {
      labelX(e.clientX);
      labelY(e.clientY);
    }

    // Particle trail
    particles.forEach((p, i) => {
      gsap.to(p, {
        x: e.clientX - 2,
        y: e.clientY - 2,
        opacity: 0.15 - (i * 0.04),
        duration: 0.3 + (i * 0.15),
        ease: "power3.out"
      });
    });

    // Fade out particles when cursor stops
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      gsap.to(particles, { opacity: 0, duration: 0.4 });
    }, 200);
  }

  on(window, "mousemove", onMouseMove);

  // Magnetic element hover — ring expands
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    on(el, "mouseenter", () => {
      gsap.to(ring, { width: 60, height: 60, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { opacity: 0, duration: 0.2 });
    });
    on(el, "mouseleave", () => {
      gsap.to(ring, { width: 40, height: 40, duration: 0.3, ease: "elastic.out(1, 0.3)" });
      gsap.to(dot, { opacity: 1, duration: 0.2 });
    });
  });

  // Contextual cursor label — any element with data-cursor-text swaps the
  // dot/ring for a solid pill naming the action ("View", "Drag", ...)
  if (label) {
    document.querySelectorAll("[data-cursor-text]").forEach((el) => {
      on(el, "mouseenter", () => {
        label.textContent = el.dataset.cursorText;
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" });
        gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
      });
      on(el, "mouseleave", () => {
        gsap.to(label, { opacity: 0, scale: 0.5, duration: 0.2, ease: "power2.in" });
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
      });
    });
  }

  return () => {
    clearTimeout(idleTimeout);
    cleanups.forEach((remove) => remove());
  };
}

registerInteraction(init);

export { init };
