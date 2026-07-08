import { EASE, EASE_INOUT, DUR, prefersReducedMotion } from "utils/motion_library";

function init(section) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReducedMotion()) {
    return { destroy() {} };
  }

  const ctx = gsap.context(() => {
    const label = section.querySelector(".exp-label");
    const items = section.querySelectorAll(".exp-item");
    const borders = section.querySelectorAll(".exp-border");
    const numbers = section.querySelectorAll(".exp-number");
    const titles = section.querySelectorAll(".exp-title");

    // Fire-once room reveal — fast, no pin
    const tl = gsap.timeline({
      defaults: { ease: EASE },
      scrollTrigger: {
        id: "EXPERIENCE_REVEAL",
        trigger: section,
        start: "top 75%",
        once: true
      }
    });

    if (label) {
      tl.from(label, { y: 20, opacity: 0, duration: DUR.fast });
    }

    if (items.length) {
      tl.from(items, {
        y: 40, opacity: 0, stagger: 0.1, duration: DUR.normal
      }, "-=0.1");
    }

    if (borders.length) {
      tl.from(borders, {
        scaleX: 0, transformOrigin: "left center",
        stagger: 0.1, duration: DUR.normal, ease: EASE_INOUT
      }, "<");
    }

    if (numbers.length) {
      tl.from(numbers, {
        x: -10, opacity: 0, stagger: 0.1, duration: DUR.fast
      }, "-=0.4");
    }

    if (titles.length) {
      tl.from(titles, {
        clipPath: "inset(0 100% 0 0)",
        stagger: 0.1, duration: DUR.normal, ease: EASE_INOUT
      }, "<");
    }
  }, section);

  return {
    destroy() {
      ctx.revert();
    }
  };
}

export { init };
