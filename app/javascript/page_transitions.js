// Page transitions — Turbo-aware room-to-room curtain with wayfinding label

let isTransitioning = false;

// Map a destination URL to a short wayfinding label
function roomLabelFor(url) {
  let path;
  try {
    path = new URL(url, window.location.origin).pathname;
  } catch {
    return "";
  }

  if (path === "/" || path === "") return "Home";
  if (path.startsWith("/resume")) return "Resume";
  if (path.startsWith("/projects/")) {
    return decodeURIComponent(path.split("/")[2] || "").replace(/-/g, " ");
  }
  return "";
}

function init() {
  if (typeof gsap === "undefined") return;

  const overlay = document.querySelector("[data-page-transition]");
  const label = document.querySelector("[data-transition-label]");
  if (!overlay) return;

  // Entrance — wipe overlay away (fresh label element starts at opacity 0)
  if (label) gsap.set(label, { opacity: 0 });
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
    const label = document.querySelector("[data-transition-label]");
    if (!overlay || typeof gsap === "undefined") return;

    e.preventDefault();
    isTransitioning = true;
    const url = e.detail.url;

    const tl = gsap.timeline({
      onComplete: () => {
        if (typeof Turbo !== "undefined") {
          Turbo.visit(url);
        } else {
          window.location.href = url;
        }
      }
    });

    tl.set(overlay, { scaleX: 0, transformOrigin: "left" })
      .to(overlay, {
        scaleX: 1,
        duration: 0.5,
        ease: "power4.inOut"
      });

    const text = label ? roomLabelFor(url) : "";
    if (label && text) {
      label.textContent = text;
      tl.fromTo(label,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        "-=0.2"
      ).to({}, { duration: 0.25 }); // hold the label for a beat
    }
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
