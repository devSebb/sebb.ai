import { splitByChars } from "utils/text_splitter";
import { prefersReducedMotion } from "utils/motion_library";

function init(section) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReducedMotion()) {
    return { destroy() {} };
  }

  const ctx = gsap.context(() => {
    const heading = section.querySelector(".contact-heading");
    const email = section.querySelector(".contact-email");
    const socialLinks = section.querySelectorAll(".contact-social a");
    const form = section.querySelector(".contact-form");
    const footer = section.querySelector(".contact-footer");

    // Split heading chars
    let chars = [];
    if (heading) {
      chars = splitByChars(heading);
    }

    // Pinned chapter reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        id: "CONTACT_PIN",
        trigger: section,
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: 1
      }
    });

    if (chars.length) {
      tl.from(chars, {
        y: 80, opacity: 0, stagger: 0.02, duration: 0.6
      });
    }

    if (email) {
      tl.from(email, { y: 20, opacity: 0, duration: 0.4 });
    }

    if (socialLinks.length) {
      tl.from(socialLinks, {
        x: -10, opacity: 0, stagger: 0.08, duration: 0.3
      });
    }

    if (form) {
      tl.from(form, {
        y: 40, opacity: 0, duration: 0.5
      }, "<+=0.2");
    }

    if (footer) {
      tl.from(footer, { opacity: 0, duration: 0.3 });
    }
  }, section);

  return {
    destroy() {
      ctx.revert();
    }
  };
}

export { init };
