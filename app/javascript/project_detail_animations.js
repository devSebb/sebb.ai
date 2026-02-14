import { splitByChars } from "utils/text_splitter";
import { charStagger, prefersReducedMotion } from "utils/motion_library";

function init(section) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReducedMotion()) {
    return { destroy() {} };
  }

  const ctx = gsap.context(() => {
    const heroImg = section.querySelector(".project-hero-img");
    const heroOverlay = section.querySelector(".project-hero-overlay");
    const title = section.querySelector(".project-detail-title");
    const metaCols = section.querySelectorAll(".project-meta-col");
    const description = section.querySelector(".project-description");
    const features = section.querySelectorAll(".project-feature");
    const galleryItems = section.querySelectorAll(".project-gallery-item");
    const navLinks = section.querySelectorAll(".project-nav-link");

    // Hero cinematic scroll-through
    if (heroImg) {
      gsap.timeline({
        scrollTrigger: {
          id: "PROJECT_DETAIL_HERO",
          trigger: ".project-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      })
      .to(heroImg, { yPercent: 30, scale: 1.1, ease: "none" }, 0)
      .to(heroOverlay, { opacity: 0.9, ease: "none" }, 0);
    }

    // Title entrance — character split
    if (title) {
      const chars = splitByChars(title);
      charStagger(chars, 0.3);
    }

    // Metadata reveal
    if (metaCols.length) {
      gsap.from(metaCols, {
        y: 20, opacity: 0, scale: 0.95,
        stagger: 0.1, duration: 0.6, ease: "power2.out",
        scrollTrigger: {
          trigger: ".project-metadata",
          start: "top 85%"
        }
      });
    }

    // Description fade in
    if (description) {
      gsap.from(description, {
        y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: description,
          start: "top 80%"
        }
      });
    }

    // Features stagger
    if (features.length) {
      gsap.from(features, {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power2.out",
        scrollTrigger: {
          trigger: features[0],
          start: "top 85%"
        }
      });
    }

    // Gallery — scale reveal
    galleryItems.forEach((item) => {
      gsap.from(item, {
        scale: 1.05, opacity: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%"
        }
      });
    });

    // Prev/next fade up
    if (navLinks.length) {
      gsap.from(navLinks, {
        y: 30, opacity: 0, stagger: 0.15, duration: 0.6, ease: "power2.out",
        scrollTrigger: {
          trigger: navLinks[0],
          start: "top 90%"
        }
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
