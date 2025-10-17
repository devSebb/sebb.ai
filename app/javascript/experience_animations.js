function initExperienceAnimations() {
  // Wait for GSAP to be fully initialized
  if (typeof gsap === 'undefined' || !window.GSAP_READY) {
    window.addEventListener('gsapInitialized', initExperienceAnimations, { once: true });
    return;
  }
  
  // Check if already initialized to prevent duplicates
  if (window.__experienceInitialized) {
    console.log('Experience already initialized, skipping');
    return;
  }
  window.__experienceInitialized = true;

  if (typeof ScrollTrigger === 'undefined') {
    console.error('ScrollTrigger not available - animations disabled');
    return;
  }

  console.log('Experience animations initializing...');

  const experienceDots = document.querySelectorAll(".experience-dot");
  if (!experienceDots.length) {
    console.warn("No elements found with class 'experience-dot'. Check selector or DOM.");
    return;
  }

  const animationConfig = {
    activeColor: "#0ED762",
    inactiveColor: "#ffffff",
    borderColor: "#e5e7eb",
    scaleActive: 1.5,
    scaleInactive: 1,
    duration: 0.3,
  };

  function animateExperiences() {
    experienceDots.forEach((dot, index) => {
      gsap.to(dot, {
        scrollTrigger: {
          trigger: dot,
          start: "top center",
          end: "bottom center",
          toggleActions: "play none none reverse",
        },
        backgroundColor: animationConfig.activeColor,
        borderColor: animationConfig.activeColor,
        scale: animationConfig.scaleActive,
        duration: animationConfig.duration,
        ease: "back.out(1.7)",
        overwrite: "auto",
        onReverseComplete: () => {
          gsap.to(dot, {
            backgroundColor: animationConfig.inactiveColor,
            borderColor: animationConfig.borderColor,
            scale: animationConfig.scaleInactive,
            duration: animationConfig.duration,
            ease: "power2.out",
            overwrite: "auto",
          });
        },
      });
    });
  }

  animateExperiences();
  console.log('Experience animations initialized successfully');

  window.addEventListener('beforeunload', () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  });
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initExperienceAnimations);
} else {
  initExperienceAnimations();
}

// Re-initialize on Turbo navigation
document.addEventListener('turbo:load', () => {
  window.__experienceInitialized = false;
  initExperienceAnimations();
});

// Clean up before Turbo caches
document.addEventListener('turbo:before-cache', () => {
  window.__experienceInitialized = false;
});
