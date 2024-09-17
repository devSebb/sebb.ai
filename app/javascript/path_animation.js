document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
  gsap.config({
    nullTargetWarn: false,
    markers: false
  });

  gsap.set("#animate-icon", {
    xPercent: 80,
    yPercent: 0,
    transformOrigin: "300% 300%",
  });

  gsap.to("#animate-icon", {
    motionPath: {
      path: "M932 0.5V863.825C932 881.354 925.693 898.298 914.23 911.56L658.078 1207.93C640.482 1228.29 635.514 1256.68 645.148 1281.81L760.138 1581.67C774.066 1617.99 757.069 1658.85 721.492 1674.57L44.7149 1973.74C-22.1582 2003.3 -8.87271 2101.9 63.4396 2112.7L869.789 2233.2C905.542 2238.55 932 2269.25 932 2305.4V2572.42C932 2605.49 909.769 2634.43 877.817 2642.96L107.183 2848.54C75.2308 2857.07 53 2886.01 53 2919.08V3403.5",
      align: "#animate-icon",
      autoRotate: true,
      alignOrigin: [-0.8, -0.8],

    },
    ease: "none",
    immediateRender: true,
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      markers: false
    }
  });
});
