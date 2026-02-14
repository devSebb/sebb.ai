// Menu overlay — toggle with clip-path animation

function init() {
  if (typeof gsap === "undefined") return;

  const toggle = document.querySelector("[data-nav-toggle]");
  const overlay = document.querySelector("[data-menu-overlay]");
  const links = overlay ? overlay.querySelectorAll("[data-menu-link]") : [];
  if (!toggle || !overlay) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    overlay.classList.add("is-open");

    gsap.timeline()
      .to(overlay, {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.6,
        ease: "power4.inOut"
      })
      .from(links, {
        y: 40, opacity: 0,
        stagger: 0.08, duration: 0.4, ease: "power3.out"
      }, "-=0.2");

    toggle.classList.add("is-open");
  }

  function closeMenu() {
    isOpen = false;

    gsap.timeline({
      onComplete: () => overlay.classList.remove("is-open")
    })
      .to(links, {
        y: -20, opacity: 0,
        stagger: 0.04, duration: 0.2, ease: "power2.in"
      })
      .to(overlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.5,
        ease: "power4.inOut"
      }, "-=0.1");

    toggle.classList.remove("is-open");
  }

  toggle.addEventListener("click", () => {
    isOpen ? closeMenu() : openMenu();
  });

  // Close menu on link click
  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (isOpen) closeMenu();
    });
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
