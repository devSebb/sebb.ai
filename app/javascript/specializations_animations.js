function init(section) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return { destroy() {} };
  }

  const title = section.querySelector("[data-animate-title='specializations']");
  const boxes = Array.from(section.querySelectorAll("[data-animate-item='specialization']"));
  const cleanups = [];
  const hoverTimelines = [];

  if (!boxes.length || !title) {
    return { destroy() {} };
  }

  gsap.set(boxes, { opacity: 0, y: 30 });
  gsap.set(title, { opacity: 0, y: 20 });

  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      end: "top 20%",
      toggleActions: "play none none reverse"
    }
  });

  masterTimeline.to(title, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power2.out"
  }, 0);

  masterTimeline.to(boxes, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.1
  }, 0.2);

  boxes.forEach((box) => {
    const hoverTimeline = gsap.timeline({ paused: true });
    hoverTimeline.to(box, {
      y: -5,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      duration: 0.3,
      ease: "power2.out"
    });

    const onEnter = () => hoverTimeline.play();
    const onLeave = () => hoverTimeline.reverse();
    box.addEventListener("mouseenter", onEnter);
    box.addEventListener("mouseleave", onLeave);
    cleanups.push(() => box.removeEventListener("mouseenter", onEnter));
    cleanups.push(() => box.removeEventListener("mouseleave", onLeave));
    hoverTimelines.push(hoverTimeline);
  });

  return {
    destroy() {
      masterTimeline.kill();
      hoverTimelines.forEach((timeline) => timeline.kill());
      cleanups.forEach((cleanup) => cleanup());
    }
  };
}

export { init };