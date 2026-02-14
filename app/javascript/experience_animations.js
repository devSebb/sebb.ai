import { prefersReducedMotion } from "utils/motion_library";

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

    // Pinned chapter with sequential row reveals
    const tl = gsap.timeline({
      scrollTrigger: {
        id: "EXPERIENCE_PIN",
        trigger: section,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 1
      }
    });

    if (label) {
      tl.from(label, { y: 20, opacity: 0, duration: 0.2 });
    }

    // Items entrance
    if (items.length) {
      tl.from(items, {
        y: 50, opacity: 0, stagger: 0.15, duration: 0.4
      });
    }

    // Border draw
    if (borders.length) {
      tl.from(borders, {
        scaleX: 0, transformOrigin: "left center",
        stagger: 0.15, duration: 0.3
      }, "<");
    }

    // Number accent pulse
    if (numbers.length) {
      numbers.forEach((num, i) => {
        tl.fromTo(num,
          { scale: 1.3, color: "#0ED762" },
          { scale: 1, color: "#0ED762", duration: 0.2 },
          `>-=${0.1 * i}`
        );
      });
    }

    // Title masked reveals
    if (titles.length) {
      tl.from(titles, {
        clipPath: "inset(0 100% 0 0)",
        stagger: 0.15, duration: 0.4, ease: "power2.inOut"
      }, "<+=0.1");
    }
  }, section);

  return {
    destroy() {
      ctx.revert();
    }
  };
}

export { init };
