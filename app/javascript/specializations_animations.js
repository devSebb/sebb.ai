// Enhanced Specializations animations with professional GSAP implementation

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
  const icons = container.querySelectorAll(".specialization-box img");

  if (!boxes.length || !title) {
    console.log('Specialization elements not found, waiting...');
    return;
  }

  // Enhanced initial state with more dramatic setup
  gsap.set(boxes, {
    scale: 0.3,
    opacity: 0,
    y: 80,
    rotationX: 45,
    transformOrigin: "center bottom"
  });
  
  gsap.set(title, {
    opacity: 0,
    y: 50,
    scale: 0.8
  });

  gsap.set(icons, {
    scale: 0,
    rotation: 180,
    opacity: 0
  });

  // Create master timeline for coordinated animations
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top 85%",
      end: "top 15%",
      toggleActions: "play reverse play reverse",
      onEnter: () => console.log('Specializations section entered'),
      onLeave: () => console.log('Specializations section left')
    }
  });

  // Title animation with sophisticated entrance
  masterTimeline
    .to(title, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.out"
    }, 0)
    .to(title, {
      textShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
      duration: 0.8,
      ease: "power2.inOut"
    }, 0.4);

  // Sophisticated staggered box animations
  boxes.forEach((box, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    
    // Create individual timeline for each box
    const boxTimeline = gsap.timeline();
    
    // Entrance animation with 3D rotation and scale
    boxTimeline
      .to(box, {
        scale: 1,
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.0,
        ease: "back.out(1.4)",
        transformOrigin: "center bottom"
      }, 0)
      .to(box, {
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
        duration: 0.6,
        ease: "power2.out"
      }, 0.3);

    // Add to master timeline with sophisticated stagger
    masterTimeline.add(boxTimeline, 0.3 + (row * 0.15) + (col * 0.1));
  });

  // Icon animations with delayed entrance
  icons.forEach((icon, index) => {
    const box = icon.closest('.specialization-box');
    const boxIndex = Array.from(boxes).indexOf(box);
    
    masterTimeline.to(icon, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
      delay: 0.5 + (boxIndex * 0.1)
    }, 0.5 + (boxIndex * 0.1));
  });

  // Enhanced hover interactions for each box
  boxes.forEach((box, index) => {
    const icon = box.querySelector('img');
    const title = box.querySelector('h2');
    const description = box.querySelector('p');
    
    // Create hover timeline
    const hoverTimeline = gsap.timeline({ paused: true });
    
    hoverTimeline
      .to(box, {
        scale: 1.05,
        y: -8,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
        borderColor: "rgba(59, 130, 246, 0.8)",
        duration: 0.4,
        ease: "power2.out"
      })
      .to(icon, {
        scale: 1.2,
        rotation: 5,
        duration: 0.3,
        ease: "back.out(1.7)"
      }, 0)
      .to(title, {
        color: "#3b82f6",
        textShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
        duration: 0.3,
        ease: "power2.out"
      }, 0)
      .to(description, {
        color: "#1e40af",
        duration: 0.3,
        ease: "power2.out"
      }, 0);

    // Add event listeners for hover
    box.addEventListener('mouseenter', () => {
      hoverTimeline.play();
    });
    
    box.addEventListener('mouseleave', () => {
      hoverTimeline.reverse();
    });
  });

  // Add subtle continuous animations for visual interest
  gsap.to(icons, {
    rotation: 360,
    duration: 20,
    ease: "none",
    repeat: -1,
    stagger: {
      amount: 2,
      from: "random"
    }
  });

  // Add floating animation to boxes
  boxes.forEach((box, index) => {
    gsap.to(box, {
      y: "+=5",
      duration: 2 + (index * 0.2),
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      delay: index * 0.3
    });
  });

  console.log('Enhanced specializations animations initialized successfully');
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