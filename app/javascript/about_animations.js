import { splitByWords } from "utils/text_splitter";
import { wordStagger, EASE, DUR, prefersReducedMotion } from "utils/motion_library";

function init(section) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReducedMotion()) {
    return { destroy() {} };
  }

  const ctx = gsap.context(() => {
    const label = section.querySelector(".about-label");
    const heading = section.querySelector(".about-heading");
    const paragraphs = section.querySelectorAll(".about-paragraph");
    const profile = section.querySelector(".about-profile");

    let words = [];
    if (heading) {
      words = splitByWords(heading);
    }

    // Fire-once room reveal — fast, no pin
    const tl = gsap.timeline({
      defaults: { ease: EASE },
      scrollTrigger: {
        id: "ABOUT_REVEAL",
        trigger: section,
        start: "top 75%",
        once: true
      }
    });

    if (label) {
      tl.from(label, { y: 24, opacity: 0, duration: DUR.fast });
    }

    if (words.length) {
      tl.add(wordStagger(words), "-=0.15");
    }

    if (paragraphs.length) {
      tl.from(paragraphs, {
        y: 30, opacity: 0, stagger: 0.12, duration: DUR.normal
      }, "-=0.45");
    }

    if (profile) {
      tl.from(profile, {
        opacity: 0, y: 20, duration: DUR.normal
      }, "-=0.4");
    }
  }, section);

  return {
    destroy() {
      ctx.revert();
    }
  };
}

export { init };
