// GSAP is loaded via CDN in the layout

function initExperienceAnimations() {
  // Check GSAP and ScrollTrigger availability
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP or ScrollTrigger not available - animations disabled');
    return;
  }

  gsap.registerPlugin(ScrollTrigger); // Explicitly register ScrollTrigger

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
          toggleActions: "play none none reverse", // Simplifies onEnter/onLeaveBack
        },
        backgroundColor: animationConfig.activeColor,
        borderColor: animationConfig.activeColor,
        scale: animationConfig.scaleActive,
        duration: animationConfig.duration,
        ease: "back.out(1.7)",
        overwrite: "auto",
        // Reset on reverse
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

  // Cleanup ScrollTriggers on page unload
  window.addEventListener('beforeunload', () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initExperienceAnimations);
} else {
  initExperienceAnimations();
}
