function init(section) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return { destroy() {} };
  }

  const title = section.querySelector("[data-animate-title='projects']");
  const projectItems = Array.from(section.querySelectorAll("[data-animate-item='project']"));
  const cleanups = [];
  const hoverTimelines = [];

  if (!projectItems.length || !title) {
    return { destroy() {} };
  }

  gsap.set(projectItems, { opacity: 0, y: 40 });
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

  masterTimeline.to(projectItems, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.15
  }, 0.2);

  projectItems.forEach((item) => {
    const image = item.querySelector("[data-animate-image='project']");
    const overlay = item.querySelector("[data-animate-overlay='project']");
    if (!image || !overlay) return;

    const hoverTimeline = gsap.timeline({ paused: true });
    hoverTimeline
      .to(item, {
        y: -8,
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
        duration: 0.3,
        ease: "power2.out"
      })
      .to(image, { scale: 1.05, duration: 0.3, ease: "power2.out" }, 0)
      .to(overlay, { opacity: 1, duration: 0.2, ease: "power2.out" }, 0.1);

    const onEnter = () => hoverTimeline.play();
    const onLeave = () => hoverTimeline.reverse();
    item.addEventListener("mouseenter", onEnter);
    item.addEventListener("mouseleave", onLeave);
    cleanups.push(() => item.removeEventListener("mouseenter", onEnter));
    cleanups.push(() => item.removeEventListener("mouseleave", onLeave));
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