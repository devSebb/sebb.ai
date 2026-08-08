import { prefersReducedMotion } from "utils/motion_library";

function init(section) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReducedMotion()) {
    return { destroy() {} };
  }

  // Non-GSAP cleanup refs (document/window listeners + ticker for the float preview)
  let pointerTracker = null;
  let tickerCheck = null;
  let windowBlurHandler = null;

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

      // Last known pointer position — used to re-check, every frame, whether the
      // cursor is still genuinely over the row the preview belongs to.
      let pointerX = -1;
      let pointerY = -1;
      let activeRow = null;

      function unblur(row) {
        const nameEl = row?.querySelector(".project-name");
        if (nameEl) {
          gsap.to(nameEl, { filter: "blur(0px)", opacity: 0.2, duration: 0.3 });
        }
      }

      function showFor(row) {
        if (activeRow === row) return;
        if (activeRow) unblur(activeRow); // row-to-row move without a mouseleave
        activeRow = row;

        const imgUrl = row.dataset.projectImage;
        const nameEl = row.querySelector(".project-name");
        if (imgUrl) floatSrc.src = imgUrl;
        if (floatCaption && nameEl) {
          const number = row.querySelector(".project-number")?.textContent.trim();
          floatCaption.textContent = number ? `${number} — ${nameEl.textContent.trim()}` : nameEl.textContent.trim();
        }
        gsap.to(floatImg, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
        if (nameEl) {
          gsap.to(nameEl, { filter: "blur(2px)", opacity: 0.4, duration: 0.3 });
        }
      }

      function hideFloat() {
        if (!activeRow) return;
        unblur(activeRow);
        activeRow = null;
        gsap.to(floatImg, { opacity: 0, scale: 0.9, duration: 0.2 });
      }

      rows.forEach((row) => {
        row.addEventListener("mouseenter", () => showFor(row));

        row.addEventListener("mousemove", (e) => {
          pointerX = e.clientX;
          pointerY = e.clientY;
          xTo(e.clientX + 20);
          yTo(e.clientY - 140);
        });

        row.addEventListener("mouseleave", hideFloat);
      });

      // Keep the pointer position fresh even when the cursor is outside the list.
      pointerTracker = function onPointerMove(e) {
        pointerX = e.clientX;
        pointerY = e.clientY;
      };
      document.addEventListener("pointermove", pointerTracker, { passive: true });

      // The preview belongs to this section and nowhere else. mouseleave alone can't
      // guarantee that: smooth scrolling (Lenis) slides the rows out from under a
      // stationary cursor, and the browser does not reliably fire mouseleave for
      // motion it didn't attribute to the pointer — which is how the preview ended up
      // pinned to the screen while you kept scrolling. So while a preview is showing,
      // verify every frame that the pointer is still inside the active row's box, and
      // drop it the moment it isn't. This is pure geometry: no dependence on scroll
      // events firing, on hit-testing through overlays, or on which section is in view.
      tickerCheck = function checkPointerStillOnRow() {
        if (!activeRow) return;
        if (pointerX < 0 || pointerY < 0) return hideFloat();
        const r = activeRow.getBoundingClientRect();
        const inside =
          pointerX >= r.left && pointerX <= r.right &&
          pointerY >= r.top && pointerY <= r.bottom;
        if (!inside) hideFloat();
      };
      gsap.ticker.add(tickerCheck);

      // Pointer left the window entirely (other app, browser chrome, tab switch) —
      // no further pointermove arrives, so the frame check would keep passing.
      windowBlurHandler = hideFloat;
      document.documentElement.addEventListener("mouseleave", windowBlurHandler);
      window.addEventListener("blur", windowBlurHandler);
    }
  }, section);

  return {
    destroy() {
      if (pointerTracker) document.removeEventListener("pointermove", pointerTracker);
      if (tickerCheck) gsap.ticker.remove(tickerCheck);
      if (windowBlurHandler) {
        document.documentElement.removeEventListener("mouseleave", windowBlurHandler);
        window.removeEventListener("blur", windowBlurHandler);
      }
      ctx.revert();
    }
  };
}

export { init };
