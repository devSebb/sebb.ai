// Magnetic buttons — all [data-magnetic] elements pull toward cursor

function init() {
  if (typeof gsap === "undefined") return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const elements = document.querySelectorAll("[data-magnetic]");

  elements.forEach((el) => {
    const strength = parseFloat(el.dataset.magneticStrength || "0.3");
    const textEl = el.querySelector("span, a") || el.firstElementChild;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      if (distance < 100) {
        gsap.to(el, {
          x: deltaX * strength,
          y: deltaY * strength,
          duration: 0.3,
          ease: "power2.out"
        });
        if (textEl && textEl !== el) {
          gsap.to(textEl, {
            x: deltaX * strength * 0.5,
            y: deltaY * strength * 0.5,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }
    }

    function onLeave() {
      gsap.to(el, {
        x: 0, y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
      });
      if (textEl && textEl !== el) {
        gsap.to(textEl, {
          x: 0, y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)"
        });
      }
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
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
