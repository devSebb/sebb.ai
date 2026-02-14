// Preloader — initial load only (sessionStorage check)

function init() {
  if (typeof gsap === "undefined") return;

  const preloader = document.querySelector("[data-preloader]");
  const preloaderText = document.querySelector("[data-preloader-text]");
  if (!preloader) return;

  // Skip on return visits — hide immediately
  if (sessionStorage.getItem("preloaderShown")) {
    preloader.style.display = "none";
    window.__preloaderComplete = true;
    return;
  }

  sessionStorage.setItem("preloaderShown", "true");

  const tl = gsap.timeline({
    onComplete: () => {
      preloader.style.display = "none";
      window.__preloaderComplete = true;
      window.dispatchEvent(new CustomEvent("preloaderComplete"));
    }
  });

  // Letters fade in
  if (preloaderText) {
    tl.from(preloaderText, {
      opacity: 0, scale: 0.8,
      duration: 0.6, ease: "power3.out"
    });
  }

  // Hold
  tl.to({}, { duration: 0.5 });

  // Letters spread and fade
  if (preloaderText) {
    tl.to(preloaderText, {
      letterSpacing: "0.5em", opacity: 0,
      duration: 0.6, ease: "power3.inOut"
    });
  }

  // Preloader wipes away
  tl.to(preloader, {
    clipPath: "inset(0 0 100% 0)",
    duration: 0.6, ease: "power4.inOut"
  }, "-=0.2");
}

function hidePreloader() {
  const preloader = document.querySelector("[data-preloader]");
  if (preloader) {
    preloader.style.display = "none";
    window.__preloaderComplete = true;
  }
}

function setup() {
  if (window.GSAP_READY) {
    init();
  } else {
    window.addEventListener("gsapInitialized", init, { once: true });
  }
}

// Initial page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setup);
} else {
  setup();
}

// On every Turbo navigation, always hide preloader
document.addEventListener("turbo:load", hidePreloader);

// Before Turbo caches the page, hide preloader so cached HTML doesn't have it visible
document.addEventListener("turbo:before-cache", hidePreloader);

export { init };
