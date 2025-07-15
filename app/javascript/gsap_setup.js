// GSAP is loaded via CDN in the layout

function setupGSAP() {
  if (typeof gsap === 'undefined') {
    console.error('GSAP not available');
    return;
  }
  
  console.log('GSAP setup completed');
}

// Initialize GSAP setup
setupGSAP();

// Export gsap for use in other files
export { gsap }; 