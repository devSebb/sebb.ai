function init(section) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return { destroy() {} };
  }

  const timelineItems = Array.from(section.querySelectorAll("[data-animate-item='resume-timeline']"));
  const tweens = timelineItems.map((item) =>
    gsap.fromTo(
      item,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    )
  );

  return {
    destroy() {
      tweens.forEach((tween) => tween.kill());
    }
  };
}

export { init };
