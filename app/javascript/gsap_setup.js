// GSAP setup with proper loading detection

console.log('GSAP setup file loaded');

function setupGSAP() {
  // Prevent duplicate initialization
  if (window.__gsapSetupComplete) {
    console.log('GSAP already set up, skipping');
    return;
  }
  
  if (typeof gsap !== 'undefined' && window.GSAP_READY) {
    console.log('GSAP ready, initializing');
    initializeGSAP();
    return;
  }
  
  console.log('Waiting for GSAP to be ready...');
  window.addEventListener('gsapReady', initializeGSAP, { once: true });
}

function initializeGSAP() {
  if (window.__gsapSetupComplete) return;
  
  console.log('initializeGSAP called');
  
  if (typeof gsap === 'undefined') {
    console.error('GSAP not available');
    return;
  }
  
  // Verify plugins
  console.log('GSAP version:', gsap.version);
  console.log('ScrollTrigger available:', typeof ScrollTrigger !== 'undefined');
  console.log('TextPlugin available:', typeof TextPlugin !== 'undefined');
  
  window.__gsapSetupComplete = true;
  window.dispatchEvent(new CustomEvent('gsapInitialized'));
  console.log('GSAP setup completed');
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