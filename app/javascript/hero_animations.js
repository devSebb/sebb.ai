import { splitByChars } from "utils/text_splitter";
import { charStagger, prefersReducedMotion } from "utils/motion_library";

function init(section) {
  if (typeof gsap === "undefined" || prefersReducedMotion()) {
    return { destroy() {} };
  }

  const ctx = gsap.context(() => {
    const titleEl = section.querySelector("[data-hero-title]");
    const meta = section.querySelector(".hero-meta");
    const tagline = section.querySelector(".hero-tagline");
    const scrollCue = section.querySelector(".hero-scroll-cue");
    const titleFront = section.querySelector(".hero-title-front");
    const titleBack = section.querySelector(".hero-title-back");

    // Split title into characters
    let chars = [];
    if (titleEl) {
      chars = splitByChars(titleEl);
    }

    // Entrance timeline — plays after preloader
    const entranceTl = gsap.timeline({
      delay: window.__preloaderComplete ? 0 : 1.8
    });

    if (meta) {
      entranceTl.from(meta, {
        y: 20, opacity: 0, duration: 0.8, ease: "power3.out"
      });
    }

    if (chars.length) {
      entranceTl.add(charStagger(chars), "-=0.4");
    }

    if (tagline) {
      entranceTl.from(tagline, {
        y: 20, opacity: 0, duration: 0.8, ease: "power3.out"
      }, "-=0.3");
    }

    if (scrollCue) {
      entranceTl.from(scrollCue, {
        opacity: 0, duration: 0.6
      });
    }

    // Scroll-driven parallax (pinned hero)
    if (typeof ScrollTrigger !== "undefined") {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          id: "HERO_PIN",
          trigger: section,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1
        }
      });

      if (titleFront) {
        scrollTl.to(titleFront, { yPercent: -20, ease: "none" }, 0);
      }
      if (titleBack) {
        scrollTl.to(titleBack, { yPercent: -8, ease: "none" }, 0);
      }

      // Fade out content as user scrolls past
      scrollTl.to(section.children, {
        opacity: 0, y: -60, ease: "none"
      }, 0.7);
    }
  }, section);

  return {
    destroy() {
      ctx.revert();
    }
  };
}

export { init };
