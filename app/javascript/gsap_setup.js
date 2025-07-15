// GSAP is loaded via CDN in the layout

function setupGSAP() {
  if (typeof gsap === 'undefined') {
    console.error('GSAP not available');
    return;
  }
  
  console.log('GSAP setup completed');
}


setupGSAP();

export { gsap }; 