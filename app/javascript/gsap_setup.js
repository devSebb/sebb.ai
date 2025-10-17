// GSAP setup with proper loading detection


function setupGSAP() {
  // Prevent duplicate initialization
  if (window.__gsapSetupComplete) {
    return;
  }
  
  if (typeof gsap !== 'undefined' && window.GSAP_READY) {
    initializeGSAP();
    return;
  }
  window.addEventListener('gsapReady', initializeGSAP, { once: true });
}

function initializeGSAP() {
  if (window.__gsapSetupComplete) return;
  
  if (typeof gsap === 'undefined') {
    return;
  }
  
  window.__gsapSetupComplete = true;
  window.dispatchEvent(new CustomEvent('gsapInitialized'));
}

// Initialize on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupGSAP);
} else {
  setupGSAP();
}

// Reset on Turbo navigation
document.addEventListener('turbo:load', () => {
  window.__gsapSetupComplete = false;
  setupGSAP();
}); 