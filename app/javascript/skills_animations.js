import { splitByChars } from "utils/text_splitter";
import { prefersReducedMotion } from "utils/motion_library";

function init(section) {
  if (typeof gsap === "undefined") {
    return { destroy() {} };
  }

  const reducedMotion = prefersReducedMotion();
  const ctx = gsap.context(() => {
    const categories = section.querySelectorAll(".skill-category");
    const items = section.querySelectorAll(".skill-item");

    // Scroll-triggered entrance animations (skip when reduced motion preferred)
    if (!reducedMotion && typeof ScrollTrigger !== "undefined") {
    // Category entrance with mask + scale + fade
    gsap.from(categories, {
      clipPath: "inset(100% 0 0 0)",
      scale: 0.95, opacity: 0,
      stagger: 0.15, duration: 0.8, ease: "power3.out",
      scrollTrigger: {
        id: "SKILLS_ENTRANCE",
        trigger: section,
        start: "top 75%"
      }
    });

    // Category headings — character animation
    const headings = section.querySelectorAll(".skill-cat-heading");
    headings.forEach((heading) => {
      const chars = splitByChars(heading);
      gsap.from(chars, {
        y: 40, opacity: 0,
        stagger: 0.02, duration: 0.6, ease: "power3.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 85%"
        }
      });
    });

    // Skill items stagger
    gsap.from(items, {
      x: -20, opacity: 0,
      stagger: 0.03, duration: 0.5, ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 60%"
      }
    });
    }

    // Marquee animations (always run — essential content, not decorative)
    const leftTrack = section.querySelector(".marquee-track-left");
    const rightTrack = section.querySelector(".marquee-track-right");

    // Seamless infinite scroll: 2 identical copies, move by 50% (one full copy) per loop
    if (leftTrack) {
      const leftTween = gsap.to(leftTrack, {
        xPercent: -50,
        ease: "none",
        repeat: -1,
        duration: 30
      });
      const container = leftTrack.closest(".marquee-container");
      if (container) {
        container.addEventListener("mouseenter", () => leftTween.pause());
        container.addEventListener("mouseleave", () => leftTween.resume());
      }
    }

    if (rightTrack) {
      const rightTween = gsap.to(rightTrack, {
        xPercent: 50,
        ease: "none",
        repeat: -1,
        duration: 35
      });
      const container = rightTrack.closest(".marquee-container");
      if (container) {
        container.addEventListener("mouseenter", () => rightTween.pause());
        container.addEventListener("mouseleave", () => rightTween.resume());
      }
    }
  }, section);

  return {
    destroy() {
      ctx.revert();
    }
  };
}

export { init };
