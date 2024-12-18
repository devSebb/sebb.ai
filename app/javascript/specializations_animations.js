document.addEventListener("DOMContentLoaded", function() {
  gsap.registerPlugin(ScrollTrigger);

  const container = document.getElementById("specializations-container");
  const boxes = document.querySelectorAll(".specialization-box");
  const title = container.querySelector("h1");

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
      ease: "power3.out"
    });

    // Boxes animation
    const boxesTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 90%",
        end: "top 5%",
        toggleActions: "play reverse play reverse",
        // markers: true,
      }
    });

    boxesTl.to(boxes, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: {
        each: 0.15,
        from: "start",
        grid: "auto",
      },
      ease: "power3.out",
    });

    // Add hover animations
    boxes.forEach(box => {
      box.addEventListener('mouseenter', () => {
        gsap.to(box.querySelector('img'), {
          rotate: 360,
          duration: 0.6,
          ease: "power2.out"
        });
      });

      box.addEventListener('mouseleave', () => {
        gsap.to(box.querySelector('img'), {
          rotate: 0,
          duration: 0.6,
          ease: "power2.out"
        });
      });
    });
  }

  animateSpecializations();
});
