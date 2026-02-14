import { splitByWords } from "utils/text_splitter";
import { wordStagger, fadeInUp, prefersReducedMotion } from "utils/motion_library";

function init(section) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReducedMotion()) {
    return { destroy() {} };
  }

  const ctx = gsap.context(() => {
    const label = section.querySelector(".about-label");
    const heading = section.querySelector(".about-heading");
    const paragraphs = section.querySelectorAll(".about-paragraph");
    const profile = section.querySelector(".about-profile");

    // Split heading into words
    let words = [];
    if (heading) {
      words = splitByWords(heading);
    }

    // Pinned chapter reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        id: "ABOUT_PIN",
        trigger: section,
        start: "top top",
        end: "+=130%",
        pin: true,
        scrub: 1
      }
    });

    if (label) {
      tl.from(label, { y: 30, opacity: 0, duration: 0.3 });
    }

    if (words.length) {
      tl.add(wordStagger(words), "-=0.1");
    }

    if (paragraphs.length) {
      tl.from(paragraphs, {
        y: 30, opacity: 0, stagger: 0.2, duration: 0.6
      }, "-=0.2");
    }

    if (profile) {
      tl.from(profile, {
        opacity: 0, scale: 0.95, duration: 0.4
      });
    }
  }, section);

  return {
    destroy() {
      ctx.revert();
    }
  };
}

export { init };
