document.addEventListener("DOMContentLoaded", function() {
  gsap.registerPlugin(ScrollTrigger);

  const container = document.getElementById("specializations-container");
  const boxes = document.querySelectorAll(".specialization-box");

  gsap.set(boxes, { scale: 0, opacity: 0 });

  function animateSpecializations() {
    ScrollTrigger.create({
      trigger: container,
      start: "center center",
      end: "center center",
      // markers: true,
      onEnter: () => {
        gsap.to(boxes, {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.3,
          ease: "back.out(1.7)",
          overwrite: "auto",
        });
      },
      onLeaveBack: () => {
        gsap.to(boxes, {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.in(1.7)",
          overwrite: "auto",
        });
      },
    });
  }

  animateSpecializations();
});
