import { splitByChars } from "utils/text_splitter";
import { charStagger, prefersReducedMotion } from "utils/motion_library";

function init(section) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReducedMotion()) {
    return { destroy() {} };
  }

  const ctx = gsap.context(() => {
    // Resume title character animation
    const title = section.querySelector(".resume-title");
    if (title) {
      const chars = splitByChars(title);
      charStagger(chars, 0.2);
    }

    // Staggered item entrance per section
    const items = section.querySelectorAll(".resume-item");
    gsap.from(items, {
      y: 30, opacity: 0,
      stagger: 0.05, duration: 0.6, ease: "power2.out",
      scrollTrigger: {
        id: "RESUME_SECTIONS",
        trigger: section,
        start: "top 75%"
      }
    });
  }, section);

  return {
    destroy() {
      ctx.revert();
    }
  };
}

export { init };
