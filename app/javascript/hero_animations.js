function init(section) {
  if (typeof gsap === "undefined") {
    return { destroy() {} };
  }

  const title = section.querySelector("[data-animate-hero-text='true']");
  const icon = section.querySelector("[data-animate-path-icon='true']");
  if (!title) return { destroy() {} };

  const texts = [
    "software developer",
    "web designer",
    "mobile app designer",
    "product manager",
    "business developer",
    "digital designer",
    "project manager",
    "product designer",
    "advertising designer"
  ];
  let index = 0;
  let timeoutId;
  let activeTween;
  let waitTween;

  function animateText() {
    activeTween = gsap.to(title, {
      duration: 2,
      text: {
        value: `I'm a ${texts[index]}`,
        delimiter: "",
        type: "diff"
      },
      ease: "power1.inOut",
      onComplete: () => {
        waitTween = gsap.to({}, {
          duration: 2,
          onComplete: () => {
            index = (index + 1) % texts.length;
            animateText();
          }
        });
      }
    });
  }

  timeoutId = setTimeout(animateText, 1000);

  let pathTimeline;
  if (icon && typeof ScrollTrigger !== "undefined") {
    gsap.set(icon, {
      xPercent: 0,
      yPercent: 0,
      position: "fixed",
      right: "5%",
      top: 0
    });

    pathTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top center",
        end: "bottom bottom",
        scrub: true
      }
    });

    pathTimeline
      .to(icon, { top: "10%" })
      .to(icon, { opacity: 0, duration: 0.2 }, "10%")
      .to(icon, { top: "80%", opacity: 0 }, "+=0.6")
      .to(icon, { opacity: 1, duration: 0.3 }, "90%");
  }

  return {
    destroy() {
      clearTimeout(timeoutId);
      if (activeTween) activeTween.kill();
      if (waitTween) waitTween.kill();
      if (pathTimeline) pathTimeline.kill();
    }
  };
}

export { init };
