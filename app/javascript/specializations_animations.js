// GSAP is loaded via CDN in the layout

document.addEventListener("DOMContentLoaded", function() {
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
});
