// GSAP is loaded via CDN in the layout

function initExperienceAnimations() {
  const container = document.getElementById("experience-container");
  const experienceDots = document.querySelectorAll(".experience-dot");

  if (!experienceDots.length) {
    console.error("No experience dots found");
    return;
  }

  function animateExperiences() {
    experienceDots.forEach((dot, index) => {
      gsap.ScrollTrigger.create({
        trigger: dot,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          gsap.to(dot, {
            backgroundColor: "#0ED762",
            borderColor: "#0ED762",
            scale: 1.5,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        },
        onLeaveBack: () => {
          gsap.to(dot, {
            backgroundColor: "#ffffff",
            borderColor: "#e5e7eb",
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      });
    });
  }

  animateExperiences();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initExperienceAnimations);
} else {
  initExperienceAnimations();
}
