// GSAP is loaded via CDN in the layout

document.addEventListener("DOMContentLoaded", function() {
  gsap.utils.toArray(".project-item").forEach((item, index) => {
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
});
