// Resume animations with proper GSAP initialization

function initResumeAnimations() {
  // Wait for GSAP to be fully initialized
  if (typeof gsap === 'undefined') {
    console.log('Waiting for GSAP to be initialized...');
    window.addEventListener('gsapInitialized', initResumeAnimations);
    return;
  }
  
  if (!window.GSAP_READY) {
    console.log('GSAP not ready yet, waiting...');
    window.addEventListener('gsapInitialized', initResumeAnimations);
    return;
  }

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

// Initialize when DOM is ready and GSAP is available
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initResumeAnimations);
} else {
  initResumeAnimations();
}
