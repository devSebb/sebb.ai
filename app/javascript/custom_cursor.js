// Custom cursor — dot + ring + particle trail
// Hidden on touch/mobile via CSS

function init() {
  if (typeof gsap === "undefined") return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const dot = document.querySelector("[data-cursor='dot']");
  const ring = document.querySelector("[data-cursor='ring']");
  const particles = document.querySelectorAll("[data-cursor-particle]");
  if (!dot || !ring) return;

  // quickTo for smooth 60fps tracking
  const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
  const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
  const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
  const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

  let idleTimeout;

  function onMouseMove(e) {
    dotX(e.clientX);
    dotY(e.clientY);
    ringX(e.clientX);
    ringY(e.clientY);

    // Particle trail
    particles.forEach((p, i) => {
      gsap.to(p, {
        x: e.clientX - 2,
        y: e.clientY - 2,
        opacity: 0.15 - (i * 0.04),
        duration: 0.3 + (i * 0.15),
        ease: "power3.out"
      });
    });

    // Fade out particles when cursor stops
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      gsap.to(particles, { opacity: 0, duration: 0.4 });
    }, 200);
  }

  window.addEventListener("mousemove", onMouseMove);

  // Magnetic element hover — ring expands
  const magnetics = document.querySelectorAll("[data-magnetic]");
  magnetics.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      gsap.to(ring, { width: 60, height: 60, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { opacity: 0, duration: 0.2 });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(ring, { width: 40, height: 40, duration: 0.3, ease: "elastic.out(1, 0.3)" });
      gsap.to(dot, { opacity: 1, duration: 0.2 });
    });
  });

  // Project row hover — ring morphs
  const projectRows = document.querySelectorAll(".project-row");
  projectRows.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      gsap.to(ring, { width: 80, height: 40, borderRadius: "20px", duration: 0.3 });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(ring, { width: 40, height: 40, borderRadius: "50%", duration: 0.3, ease: "elastic.out(1, 0.3)" });
    });
  });

  // Gallery viewport hover — ring becomes wide pill for drag
  const galleryViewports = document.querySelectorAll("[data-gallery-viewport]");
  galleryViewports.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      gsap.to(ring, { width: 80, height: 40, borderRadius: "20px", duration: 0.3 });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(ring, { width: 40, height: 40, borderRadius: "50%", duration: 0.3, ease: "elastic.out(1, 0.3)" });
    });
  });
}

// Init on load and turbo navigate
function setup() {
  if (window.GSAP_READY) {
    init();
  } else {
    window.addEventListener("gsapInitialized", init, { once: true });
  }
}

document.addEventListener("turbo:load", setup);
if (document.readyState !== "loading") setup();

export { init };
