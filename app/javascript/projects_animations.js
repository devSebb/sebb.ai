// Enhanced Projects animations with professional GSAP implementation

function initProjectsAnimations() {
  // Wait for GSAP to be fully initialized
  if (typeof gsap === 'undefined' || !window.GSAP_READY) {
    window.addEventListener('gsapInitialized', initProjectsAnimations, { once: true });
    return;
  }
  
  // Check if already initialized to prevent duplicates
  if (window.__projectsInitialized) {
    console.log('Projects already initialized, skipping');
    return;
  }
  window.__projectsInitialized = true;

  const container = document.getElementById("projects-container");
  const projectItems = gsap.utils.toArray(".project-item");
  const title = document.querySelector("#projects-container").previousElementSibling; // The h2 title
  
  if (!projectItems.length || !container) {
    console.log('Project elements not found, waiting...');
    return;
  }

  // Enhanced initial state with dramatic setup
  gsap.set(projectItems, {
    scale: 0.3,
    opacity: 0,
    y: 100,
    rotationX: 30,
    rotationY: 15,
    transformOrigin: "center bottom"
  });
  
  gsap.set(title, {
    opacity: 0,
    y: 50,
    scale: 0.8
  });

  // Get all images and overlay elements
  const projectImages = container.querySelectorAll(".project-item img");
  const projectOverlays = container.querySelectorAll(".project-item .absolute");
  const projectTitles = container.querySelectorAll(".project-item a");
  const projectDescriptions = container.querySelectorAll(".project-item p");
  const projectButtons = container.querySelectorAll(".project-item .px-6");

  gsap.set(projectImages, {
    scale: 1.1,
    opacity: 0.7
  });

  gsap.set(projectOverlays, {
    opacity: 0,
    y: 20
  });

  gsap.set([...projectTitles, ...projectDescriptions, ...projectButtons], {
    opacity: 0,
    y: 30
  });

  // Create master timeline for coordinated animations
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top 85%",
      end: "top 15%",
      toggleActions: "play reverse play reverse",
      onEnter: () => console.log('Projects section entered'),
      onLeave: () => console.log('Projects section left')
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

  // Sophisticated staggered project animations
  projectItems.forEach((item, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    
    // Create individual timeline for each project
    const projectTimeline = gsap.timeline();
    
    // Entrance animation with 3D rotation and scale
    projectTimeline
      .to(item, {
        scale: 1,
        opacity: 1,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 1.2,
        ease: "back.out(1.4)",
        transformOrigin: "center bottom"
      }, 0)
      .to(item, {
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
        duration: 0.8,
        ease: "power2.out"
      }, 0.4);

    // Add to master timeline with sophisticated stagger
    masterTimeline.add(projectTimeline, 0.3 + (row * 0.2) + (col * 0.15));
  });

  // Image animations with delayed entrance
  projectImages.forEach((image, index) => {
    masterTimeline.to(image, {
      scale: 1,
      opacity: 1,
      duration: 1.0,
      ease: "power2.out",
      delay: 0.6 + (index * 0.1)
    }, 0.6 + (index * 0.1));
  });

  // Enhanced hover interactions for each project
  projectItems.forEach((item, index) => {
    const image = item.querySelector('img');
    const overlay = item.querySelector('.absolute');
    const title = item.querySelector('a');
    const description = item.querySelector('p');
    const button = item.querySelector('.px-6');
    
    // Set initial state for professional title animations
    gsap.set(title, {
      opacity: 0,
      y: 40,
      scale: 0.8,
      rotationX: 15,
      textShadow: "0 0 0px rgba(59, 130, 246, 0)",
      filter: "blur(2px)"
    });
    
    // Create hover timeline with sophisticated title animations
    const hoverTimeline = gsap.timeline({ paused: true });
    
    hoverTimeline
      .to(item, {
        scale: 1.05,
        y: -12,
        rotationX: -5,
        rotationY: 5,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
        duration: 0.5,
        ease: "power2.out"
      })
      .to(image, {
        scale: 1.15,
        duration: 0.4,
        ease: "power2.out"
      }, 0)
      .to(overlay, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      }, 0.1)
      // Professional title entrance animation
      .to(title, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        transformOrigin: "center bottom"
      }, 0.2)
      .to(title, {
        color: "#3b82f6",
        textShadow: "0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)",
        filter: "blur(0px)",
        duration: 0.4,
        ease: "power2.out"
      }, 0.3)
      // Add subtle title pulse effect
      .to(title, {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1
      }, 0.6)
      .to(description, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      }, 0.4)
      .to(button, {
        opacity: 1,
        y: 0,
        scale: 1.05,
        duration: 0.3,
        ease: "back.out(1.7)"
      }, 0.5);

    // Create sophisticated exit timeline for smooth title transitions
    const exitTimeline = gsap.timeline({ paused: true });
    
    exitTimeline
      .to(title, {
        scale: 0.9,
        opacity: 0.7,
        duration: 0.2,
        ease: "power2.in"
      })
      .to(title, {
        y: 20,
        rotationX: -10,
        textShadow: "0 0 0px rgba(59, 130, 246, 0)",
        filter: "blur(1px)",
        duration: 0.3,
        ease: "power2.in"
      }, 0.1)
      .to(title, {
        opacity: 0,
        y: 40,
        scale: 0.8,
        rotationX: 15,
        filter: "blur(2px)",
        duration: 0.2,
        ease: "power2.in"
      }, 0.2);

    // Add event listeners for hover with sophisticated timing
    item.addEventListener('mouseenter', () => {
      exitTimeline.pause();
      hoverTimeline.play();
    });
    
    item.addEventListener('mouseleave', () => {
      hoverTimeline.pause();
      exitTimeline.play();
    });
  });

  // Add subtle continuous animations for visual interest
  gsap.to(projectImages, {
    rotation: 2,
    duration: 8,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
    stagger: {
      amount: 3,
      from: "random"
    }
  });

  // Add floating animation to project items
  projectItems.forEach((item, index) => {
    gsap.to(item, {
      y: "+=8",
      duration: 3 + (index * 0.3),
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      delay: index * 0.5
    });
  });

  // Add subtle rotation animation to project cards
  projectItems.forEach((item, index) => {
    gsap.to(item, {
      rotationY: 1,
      duration: 6 + (index * 0.5),
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      delay: index * 0.8
    });
  });

  // Add entrance animation for overlay elements on scroll
  projectOverlays.forEach((overlay, index) => {
    gsap.fromTo(overlay, {
      opacity: 0,
      y: 20,
      scale: 0.9
    }, {
      opacity: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: overlay.closest('.project-item'),
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse"
      },
      delay: index * 0.1
    });
  });

  // Add subtle continuous title animations for visual interest
  const allTitles = container.querySelectorAll(".project-item a");
  allTitles.forEach((title, index) => {
    // Add subtle text shadow pulse animation
    gsap.to(title, {
      textShadow: "0 0 5px rgba(59, 130, 246, 0.3)",
      duration: 3 + (index * 0.5),
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      delay: index * 0.8
    });
  });

  console.log('Enhanced projects animations initialized successfully');
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