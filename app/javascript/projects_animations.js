// Clean and professional Projects animations

function initProjectsAnimations() {
  // Wait for GSAP to be fully initialized
  if (typeof gsap === 'undefined' || !window.GSAP_READY) {
    window.addEventListener('gsapInitialized', initProjectsAnimations, { once: true });
    return;
  }
  
  // Check if already initialized to prevent duplicates
  if (window.__projectsInitialized) {
    return;
  }
  window.__projectsInitialized = true;

  const container = document.getElementById("projects-container");
  const projectItems = gsap.utils.toArray(".project-item");
  const title = document.querySelector("#projects-container").previousElementSibling; // The h2 title
  
  if (!projectItems.length || !container) {
    return;
  }

  // Simple initial state
  gsap.set(projectItems, {
    opacity: 0,
    y: 40
  });
  
  gsap.set(title, {
    opacity: 0,
    y: 20
  });

  // Create simple timeline for clean entrance
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top 80%",
      end: "top 20%",
      toggleActions: "play none none reverse"
    }
  });

  // Clean title animation
  masterTimeline.to(title, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power2.out"
  }, 0);

  // Simple staggered project animations
  masterTimeline.to(projectItems, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.15
  }, 0.2);

  // Clean hover interactions
  projectItems.forEach((item) => {
    const image = item.querySelector('img');
    const overlay = item.querySelector('.absolute');
    
    const hoverTimeline = gsap.timeline({ paused: true });
    
    hoverTimeline
      .to(item, {
        y: -8,
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
        duration: 0.3,
        ease: "power2.out"
      })
      .to(image, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      }, 0)
      .to(overlay, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out"
      }, 0.1);

    // Add event listeners for hover
    item.addEventListener('mouseenter', () => {
      hoverTimeline.play();
    });
    
    item.addEventListener('mouseleave', () => {
      hoverTimeline.reverse();
    });
  });

}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProjectsAnimations);
} else {
  initProjectsAnimations();
}

// Re-initialize on Turbo navigation
document.addEventListener('turbo:load', () => {
  window.__projectsInitialized = false;
  initProjectsAnimations();
});

// Clean up before Turbo caches
document.addEventListener('turbo:before-cache', () => {
  window.__projectsInitialized = false;
});