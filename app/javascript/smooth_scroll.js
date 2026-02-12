// Smooth Scrolling with Lenis
// This provides better performance and more control than CSS scroll-behavior

// Initialize Lenis smooth scrolling
let lenis;
let rafId;
let anchorHandler;

// Function to initialize smooth scrolling
function initSmoothScroll() {
  if (lenis) return;

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

    // Single RAF driver for smooth scrolling
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
    }
  }
}

// Function to handle anchor link clicks for smooth scrolling
function initAnchorSmoothScroll() {
  if (anchorHandler) return;
  anchorHandler = function(e) {
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
  };
  document.addEventListener('click', anchorHandler);
}

// Main initialization function
function initSmoothScrollSystem() {
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
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
  if (anchorHandler) {
    document.removeEventListener("click", anchorHandler);
    anchorHandler = null;
  }
});

document.addEventListener('turbo:load', initSmoothScrollSystem);

// Export for potential use in other modules
export { lenis, initSmoothScroll, initAnchorSmoothScroll }; 