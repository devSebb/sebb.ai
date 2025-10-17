// Resume animations with proper GSAP initialization

function initResumeAnimations() {
  // Wait for GSAP to be fully initialized
  if (typeof gsap === 'undefined' || !window.GSAP_READY) {
    window.addEventListener('gsapInitialized', initResumeAnimations, { once: true });
    return;
  }
  
  // Check if already initialized to prevent duplicates
  if (window.__resumeInitialized) {
    console.log('Resume already initialized, skipping');
    return;
  }
  window.__resumeInitialized = true;

  // Timeline Animations
  const timelineItems = gsap.utils.toArray('.timeline-item');
  if (timelineItems.length) {
    timelineItems.forEach((item, i) => {
      gsap.fromTo(item, { opacity: 0, y: 50 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });
    });
  }

  // Skill Cards Hover Effect
  const skillCards = gsap.utils.toArray('.group');
  if (skillCards.length) {
    skillCards.forEach((card) => {
      const absoluteElement = card.querySelector('.absolute');
      if (absoluteElement) {
        let hover = gsap.to(absoluteElement, {
          opacity: 1,
          paused: true,
          duration: 0.5,
          ease: 'power1.inOut'
        });

        card.addEventListener('mouseenter', () => hover.play());
        card.addEventListener('mouseleave', () => hover.reverse());
      }
    });
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initResumeAnimations);
} else {
  initResumeAnimations();
}

// Re-initialize on Turbo navigation
document.addEventListener('turbo:load', () => {
  window.__resumeInitialized = false;
  initResumeAnimations();
});

// Clean up before Turbo caches
document.addEventListener('turbo:before-cache', () => {
  window.__resumeInitialized = false;
});
