function init(section) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return { destroy() {} };
  }

  const dots = Array.from(section.querySelectorAll("[data-animate-dot='experience']"));
  if (!dots.length) return { destroy() {} };

  const tweens = dots.map((dot) =>
    gsap.to(dot, {
      scrollTrigger: {
        trigger: dot,
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse"
      },
      backgroundColor: "#0ED762",
      borderColor: "#0ED762",
      scale: 1.5,
      duration: 0.3,
      ease: "back.out(1.7)",
      overwrite: "auto",
      onReverseComplete: () => {
        gsap.to(dot, {
          backgroundColor: "#ffffff",
          borderColor: "#e5e7eb",
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    })
  );

  return {
    destroy() {
      tweens.forEach((tween) => tween.kill());
    }
  };
}

export { init };
