document.addEventListener("DOMContentLoaded", function(){
  gsap.registerPlugin(ScrollTrigger);
  const container = document.getElementById("experience-container");
  const experienceDots = document.querySelectorAll(".experience-dot");

  function animateExperiences(){
    experienceDots.forEach((dot, index) => {
      ScrollTrigger.create({
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
            borderColor: "#ffffff",
            scale: 1,
            duration: 0.3,
            ease: "back.in(1.7)",
          });
        }
      });
    });
  }

  animateExperiences();
});
