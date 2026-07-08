import { prefersReducedMotion } from "utils/motion_library";

function init(section) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReducedMotion()) {
    return { destroy() {} };
  }

  const ctx = gsap.context(() => {
    const rows = section.querySelectorAll(".project-row");
    const floatImg = section.querySelector(".project-float-img");
    const floatSrc = floatImg ? floatImg.querySelector("[data-project-float-src]") : null;

    // Section entrance — stagger rows
    gsap.from(rows, {
      y: 60, opacity: 0,
      stagger: 0.1, duration: 0.8, ease: "power3.out",
      scrollTrigger: {
        id: "PROJECTS_ENTRANCE",
        trigger: section,
        start: "top 75%"
      }
    });

    // Border draw animation
    const borders = section.querySelectorAll(".border-t");
    gsap.from(borders, {
      scaleX: 0, transformOrigin: "left center",
      stagger: 0.1, duration: 0.6, ease: "power2.inOut",
      scrollTrigger: {
        trigger: section,
        start: "top 75%"
      }
    });

    // Hover system — floating cursor-follow image (desktop only)
    if (floatImg && floatSrc && window.matchMedia("(pointer: fine)").matches) {
      const floatCaption = floatImg.querySelector("[data-project-float-caption]");
      const xTo = gsap.quickTo(floatImg, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(floatImg, "y", { duration: 0.4, ease: "power3" });

      rows.forEach((row) => {
        const imgUrl = row.dataset.projectImage;
        const nameEl = row.querySelector(".project-name");

        row.addEventListener("mouseenter", () => {
          if (imgUrl) floatSrc.src = imgUrl;
          if (floatCaption && nameEl) {
            const number = row.querySelector(".project-number")?.textContent.trim();
            floatCaption.textContent = number ? `${number} — ${nameEl.textContent.trim()}` : nameEl.textContent.trim();
          }
          gsap.to(floatImg, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
          if (nameEl) {
            gsap.to(nameEl, { filter: "blur(2px)", opacity: 0.4, duration: 0.3 });
          }
        });

        row.addEventListener("mousemove", (e) => {
          xTo(e.clientX + 20);
          yTo(e.clientY - 140);
        });

        row.addEventListener("mouseleave", () => {
          gsap.to(floatImg, { opacity: 0, scale: 0.9, duration: 0.2 });
          if (nameEl) {
            gsap.to(nameEl, { filter: "blur(0px)", opacity: 0.2, duration: 0.3 });
          }
        });
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
