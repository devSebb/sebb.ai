// Page transitions — Turbo-aware animation lifecycle

let isTransitioning = false;

function init() {
  if (typeof gsap === "undefined") return;

  const overlay = document.querySelector("[data-page-transition]");
  if (!overlay) return;

  // Entrance — wipe overlay away
  gsap.to(overlay, {
    scaleX: 0,
    duration: 0.5,
    ease: "power4.inOut",
    transformOrigin: "right"
  });

  isTransitioning = false;
}

function setupExitTransition() {
  document.addEventListener("turbo:before-visit", (e) => {
    // Skip if we're already mid-transition (this is the replayed visit)
    if (isTransitioning) {
      isTransitioning = false;
      return;
    }

    const overlay = document.querySelector("[data-page-transition]");
    if (!overlay || typeof gsap === "undefined") return;

    e.preventDefault();
    isTransitioning = true;
    const url = e.detail.url;

    gsap.timeline({
      onComplete: () => {
        if (typeof Turbo !== "undefined") {
          Turbo.visit(url);
        } else {
          window.location.href = url;
        }
      }
    })
    .set(overlay, { scaleX: 0, transformOrigin: "left" })
    .to(overlay, {
      scaleX: 1,
      duration: 0.5,
      ease: "power4.inOut"
    });
  });
}

// Setup
function setup() {
  if (window.GSAP_READY) {
    init();
  } else {
    window.addEventListener("gsapInitialized", init, { once: true });
  }
}

document.addEventListener("turbo:load", setup);
setupExitTransition();

export { init };
