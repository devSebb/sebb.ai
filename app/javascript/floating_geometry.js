// Floating geometry manager — persistent background depth layer
// Parallax on scroll + subtle cursor response

function init() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const geos = document.querySelectorAll(".floating-geo");
  if (!geos.length) return;

  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  geos.forEach((el) => {
    const speed = parseFloat(el.dataset.speed || "0.3");

    // Scroll parallax
    gsap.to(el, {
      y: () => -(window.innerHeight * speed),
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Cursor response (desktop only)
    if (!isMobile) {
      const cursorWeight = parseFloat(el.dataset.cursorWeight || "0.02");
      const xTo = gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" });

      window.addEventListener("mousemove", (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        xTo((e.clientX - centerX) * cursorWeight);
        yTo((e.clientY - centerY) * cursorWeight);
      });
    }
  });
}

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
