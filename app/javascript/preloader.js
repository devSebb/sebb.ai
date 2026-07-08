// Preloader — initial load only (sessionStorage check)

function init() {
  if (typeof gsap === "undefined") return;

  const preloader = document.querySelector("[data-preloader]");
  const text = document.querySelector("[data-preloader-text]");
  const sub = document.querySelector("[data-preloader-sub]");
  const counter = document.querySelector("[data-preloader-counter]");
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

  // Ticket stamps in
  if (text) {
    tl.from(text, { y: 24, opacity: 0, duration: 0.5, ease: "expo.out" });
  }
  if (sub) {
    tl.from(sub, { y: 12, opacity: 0, duration: 0.4, ease: "expo.out" }, "-=0.3");
  }

  // Catalogue counter — eased steps like a museum entry stamp
  if (counter) {
    const num = { value: 0 };
    const render = () => {
      counter.textContent = `Nº ${String(Math.round(num.value)).padStart(3, "0")}`;
    };
    tl.from(counter, { opacity: 0, duration: 0.3 }, "-=0.2")
      .to(num, { value: 47, duration: 0.45, ease: "power2.out", onUpdate: render }, "<")
      .to({}, { duration: 0.12 })
      .to(num, { value: 100, duration: 0.45, ease: "power3.inOut", onUpdate: render });
  }

  // Ticket clears
  tl.to([text, sub, counter].filter(Boolean), {
    y: -16, opacity: 0, stagger: 0.05,
    duration: 0.4, ease: "power3.inOut"
  }, "+=0.15");

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

// turbo:load also fires on the initial page load, which is already handled by
// setup() above. Ignore that first event so it can't cut off the intro on a
// first visit; only hide the (re-inserted) preloader on later navigations.
let firstTurboLoadSeen = false;
document.addEventListener("turbo:load", () => {
  if (!firstTurboLoadSeen) {
    firstTurboLoadSeen = true;
    return;
  }
  hidePreloader();
});

// Before Turbo caches the page, hide preloader so cached HTML doesn't have it visible
document.addEventListener("turbo:before-cache", hidePreloader);

export { init };
