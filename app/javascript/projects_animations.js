// Projects animations with proper GSAP initialization

function initProjectsAnimations() {
  // Wait for GSAP to be fully initialized
  if (typeof gsap === 'undefined') {
    console.log('Waiting for GSAP to be initialized...');
    window.addEventListener('gsapInitialized', initProjectsAnimations);
    return;
  }
  
  if (!window.GSAP_READY) {
    console.log('GSAP not ready yet, waiting...');
    window.addEventListener('gsapInitialized', initProjectsAnimations);
    return;
  }

  const projectItems = gsap.utils.toArray(".project-item");
  if (!projectItems.length) {
    console.log('No project items found, waiting...');
    return;
  }

  projectItems.forEach((item, index) => {
    gsap.fromTo(item,
      {
        opacity: 0,
        y: 100
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          end: "top 30%",
          scrub: true,
          toggleActions: "play none none reverse",
        },
        delay: index * 0.2
      }
    );
  });
}

// Initialize when DOM is ready and GSAP is available
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProjectsAnimations);
} else {
  initProjectsAnimations();
}
