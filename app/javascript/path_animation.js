// GSAP is loaded via CDN in the layout

document.addEventListener("DOMContentLoaded", (event) => {
  gsap.set("#animate-icon", {
    xPercent: 0,
    yPercent: 0,
    position: "fixed",
    right: "5%",
    top: 0
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "body",
      start: "top center",
      end: "bottom bottom",
      scrub: true,
      markers: false,
      pin: false
    }
  });

  tl.to("#animate-icon", { top: "10%" })
    .to("#animate-icon", { opacity: 0, duration: 0.2 }, "10%")
    .to("#animate-icon", { top: "80%", opacity: 0 }, "+=0.6")
    .to("#animate-icon", { opacity: 1, duration: 0.3 }, "90%");
});
