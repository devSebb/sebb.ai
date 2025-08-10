// Specializations animations with proper GSAP initialization

function initSpecializationsAnimations() {
  // Wait for GSAP to be fully initialized
  if (typeof gsap === 'undefined') {
    console.log('Waiting for GSAP to be initialized...');
    window.addEventListener('gsapInitialized', initSpecializationsAnimations);
    return;
  }
  
  if (!window.GSAP_READY) {
    console.log('GSAP not ready yet, waiting...');
    window.addEventListener('gsapInitialized', initSpecializationsAnimations);
    return;
  }

  const container = document.getElementById("specializations-container");
  if (!container) {
    console.log('Specializations container not found, waiting...');
    return;
  }

  const boxes = container.querySelectorAll(".specialization-box");
  const title = container.querySelector("h1");

  if (!boxes.length || !title) {
    console.log('Specialization elements not found, waiting...');
    return;
  }

  // Initial state
  gsap.set(boxes, {
    scale: 0.8,
    opacity: 0,
    y: 50
  });
  gsap.set(title, {
    opacity: 0,
    y: 30
  });

  function animateSpecializations() {
    // Title animation
    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play reverse play reverse",
      }
    });

    titleTl.to(title, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    });

    // Boxes animation
    boxes.forEach((box, index) => {
      gsap.to(box, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: index * 0.1,
        scrollTrigger: {
          trigger: box,
          start: "top 85%",
          end: "top 15%",
          toggleActions: "play reverse play reverse",
        }
      });
    });
  }

  animateSpecializations();
}

// Initialize when DOM is ready and GSAP is available
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSpecializationsAnimations);
} else {
  initSpecializationsAnimations();
}
