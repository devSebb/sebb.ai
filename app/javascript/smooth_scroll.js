// Smooth Scrolling with Lenis
// This provides better performance and more control than CSS scroll-behavior

// Initialize Lenis smooth scrolling
let lenis;

// Function to initialize smooth scrolling
function initSmoothScroll() {
  // Check if Lenis is available (loaded via CDN)
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // RAF for smooth scrolling
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integrate with GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && gsap.ScrollTrigger) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }

    console.log('Smooth scrolling initialized with Lenis');
  } else {
    console.log('Lenis not available, falling back to CSS smooth scrolling');
  }
}

// Function to handle anchor link clicks for smooth scrolling
function initAnchorSmoothScroll() {
  document.addEventListener('click', function(e) {
    const target = e.target.closest('a[href^="#"]');
    
    if (target) {
      e.preventDefault();
      const href = target.getAttribute('href');
      
      if (href === '#') return;
      
      const targetElement = document.querySelector(href);
      
      if (targetElement) {
        if (lenis) {
          // Use Lenis for smooth scrolling
          lenis.scrollTo(targetElement, {
            offset: -80, // Adjust offset as needed for fixed headers
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          // Fallback to native smooth scrolling
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    }
  });
}

// Main initialization function
function initSmoothScrollSystem() {
  // Wait for GSAP to be fully initialized if we need it
  if (typeof gsap !== 'undefined' && !window.GSAP_READY) {
    console.log('Waiting for GSAP to be initialized...');
    window.addEventListener('gsapInitialized', initSmoothScrollSystem);
    return;
  }

  initSmoothScroll();
  initAnchorSmoothScroll();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSmoothScrollSystem);
} else {
  initSmoothScrollSystem();
}

// Add Turbo lifecycle support for Lenis
document.addEventListener('turbo:before-cache', () => {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
});

document.addEventListener('turbo:load', initSmoothScrollSystem);

// Export for potential use in other modules
export { lenis, initSmoothScroll, initAnchorSmoothScroll }; 