// GSAP setup with proper loading detection

console.log('GSAP setup file loaded');

function setupGSAP() {
  console.log('setupGSAP called');
  console.log('GSAP available:', typeof gsap !== 'undefined');
  console.log('GSAP_READY flag:', window.GSAP_READY);
  
  // Check if GSAP is already available
  if (typeof gsap !== 'undefined' && window.GSAP_READY) {
    console.log('GSAP already ready, setting up immediately');
    initializeGSAP();
    return;
  }
  
  // Wait for GSAP to be ready
  if (typeof gsap === 'undefined') {
    console.log('Waiting for GSAP to load...');
    window.addEventListener('gsapReady', initializeGSAP);
  } else {
    // GSAP is loaded but not ready yet
    console.log('GSAP loaded but not ready, waiting for gsapReady event...');
    window.addEventListener('gsapReady', initializeGSAP);
  }
}

function initializeGSAP() {
  console.log('initializeGSAP called');
  
  if (typeof gsap === 'undefined') {
    console.error('GSAP not available during initialization');
    return;
  }
  
  // Test GSAP functionality
  try {
    console.log('Testing GSAP functionality...');
    gsap.to({}, { duration: 0.1, onComplete: () => console.log('GSAP functionality test passed') });
    console.log('GSAP functionality test successful');
  } catch (error) {
    console.error('GSAP functionality test failed:', error);
  }
  
  // Verify plugins are available
  if (typeof ScrollTrigger === 'undefined') {
    console.error('ScrollTrigger plugin not available');
  } else {
    console.log('ScrollTrigger plugin available');
  }
  
  if (typeof TextPlugin === 'undefined') {
    console.error('TextPlugin not available');
  } else {
    console.log('TextPlugin available');
  }
  
  console.log('GSAP setup completed successfully');
  console.log('GSAP version:', gsap.version);
  console.log('Available plugins:', gsap.plugins);
  
  // Dispatch event that other modules can listen for
  window.dispatchEvent(new CustomEvent('gsapInitialized'));
  console.log('gsapInitialized event dispatched');
}

// Start setup when DOM is ready
if (document.readyState === "loading") {
  console.log('DOM still loading, waiting for DOMContentLoaded...');
  document.addEventListener("DOMContentLoaded", setupGSAP);
} else {
  console.log('DOM already ready, calling setupGSAP immediately');
  setupGSAP();
} 