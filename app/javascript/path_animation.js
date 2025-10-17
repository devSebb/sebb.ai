// Path animation with proper GSAP initialization

function initPathAnimation() {
  // Wait for GSAP to be fully initialized
  if (typeof gsap === 'undefined' || !window.GSAP_READY) {
    window.addEventListener('gsapInitialized', initPathAnimation, { once: true });
    return;
  }
  
  // Check if already initialized to prevent duplicates
  if (window.__pathInitialized) {
    console.log('Path already initialized, skipping');
    return;
  }
  window.__pathInitialized = true;

  const animateIcon = document.querySelector("#animate-icon");
  if (!animateIcon) {
    console.log('Animate icon not found, waiting...');
    return;
  }

  gsap.set(animateIcon, {
    xPercent: 0,
    yPercent: 0,
    position: "fixed",
    right: "5%",
    top: 0
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "body",
      start: "top center",
      end: "bottom bottom",
      scrub: true,
      markers: false,
      pin: false
    }
  });

  tl.to(animateIcon, { top: "10%" })
    .to(animateIcon, { opacity: 0, duration: 0.2 }, "10%")
    .to(animateIcon, { top: "80%", opacity: 0 }, "+=0.6")
    .to(animateIcon, { opacity: 1, duration: 0.3 }, "90%");
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPathAnimation);
} else {
  initPathAnimation();
}

// Re-initialize on Turbo navigation
document.addEventListener('turbo:load', () => {
  window.__pathInitialized = false;
  initPathAnimation();
});

// Clean up before Turbo caches
document.addEventListener('turbo:before-cache', () => {
  window.__pathInitialized = false;
});
