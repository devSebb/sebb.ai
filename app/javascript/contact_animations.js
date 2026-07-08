import { splitByChars } from "utils/text_splitter";
import { charStagger, EASE, DUR, prefersReducedMotion } from "utils/motion_library";

function init(section) {
  // Submit micro-state — button acknowledges the send while the POST runs.
  // Not motion: bind it even under reduced-motion / missing GSAP.
  const formEl = section.querySelector("[data-contact-form]");
  const submitBtn = section.querySelector("[data-contact-submit]");
  const onSubmit = () => {
    if (!submitBtn) return;
    submitBtn.value = "Sending…";
    submitBtn.disabled = true;
  };
  if (formEl) formEl.addEventListener("submit", onSubmit);
  const destroyForm = () => {
    if (formEl) formEl.removeEventListener("submit", onSubmit);
  };

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReducedMotion()) {
    return { destroy: destroyForm };
  }

  const ctx = gsap.context(() => {
    const heading = section.querySelector(".contact-heading");
    const email = section.querySelector(".contact-email");
    const socialLinks = section.querySelectorAll(".contact-social a");
    const form = section.querySelector(".contact-form");
    const footer = section.querySelector(".contact-footer");

    let chars = [];
    if (heading) {
      chars = splitByChars(heading);
    }

    // Fire-once room reveal — fast, no pin
    const tl = gsap.timeline({
      defaults: { ease: EASE },
      scrollTrigger: {
        id: "CONTACT_REVEAL",
        trigger: section,
        start: "top 70%",
        once: true
      }
    });

    if (chars.length) {
      tl.add(charStagger(chars));
    }

    if (email) {
      tl.from(email, { y: 20, opacity: 0, duration: DUR.normal }, "-=0.5");
    }

    if (socialLinks.length) {
      tl.from(socialLinks, {
        x: -10, opacity: 0, stagger: 0.06, duration: DUR.fast
      }, "-=0.4");
    }

    if (form) {
      tl.from(form, {
        y: 40, opacity: 0, duration: DUR.normal
      }, "-=0.5");
    }

    if (footer) {
      tl.from(footer, { opacity: 0, duration: DUR.normal }, "-=0.3");
    }
  }, section);

  return {
    destroy() {
      destroyForm();
      ctx.revert();
    }
  };
}

export { init };
