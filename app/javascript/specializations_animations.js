// Clean and professional Specializations animations

function initSpecializationsAnimations() {
  // Wait for GSAP to be fully initialized
  if (typeof gsap === 'undefined' || !window.GSAP_READY) {
    window.addEventListener('gsapInitialized', initSpecializationsAnimations, { once: true });
    return;
  }
  
  // Check if already initialized to prevent duplicates
  if (window.__specializationsInitialized) {
    console.log('Specializations already initialized, skipping');
    return;
  }
  window.__specializationsInitialized = true;

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

  // Simple initial state
  gsap.set(boxes, {
    opacity: 0,
    y: 30
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

  // Simple staggered box animations
  masterTimeline.to(boxes, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.1
  }, 0.2);

  // Clean hover interactions
  boxes.forEach((box) => {
    const hoverTimeline = gsap.timeline({ paused: true });
    
    hoverTimeline.to(box, {
      y: -5,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      duration: 0.3,
      ease: "power2.out"
    });

    // Add event listeners for hover
    box.addEventListener('mouseenter', () => {
      hoverTimeline.play();
    });
    
    box.addEventListener('mouseleave', () => {
      hoverTimeline.reverse();
    });
  });

  console.log('Specializations animations initialized successfully');
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSpecializationsAnimations);
} else {
  initSpecializationsAnimations();
}

// Re-initialize on Turbo navigation
document.addEventListener('turbo:load', () => {
  window.__specializationsInitialized = false;
  initSpecializationsAnimations();
});

// Clean up before Turbo caches
document.addEventListener('turbo:before-cache', () => {
  window.__specializationsInitialized = false;
});