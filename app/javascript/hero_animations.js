document.addEventListener("DOMContentLoaded", function() {
  gsap.registerPlugin(TextPlugin);
  const title = document.querySelector("#hero-text");

  const texts = [
    "software developer",
    "web designer",
    "full-stack engineer",
    "project manager",
    "product manager"
  ];
  let index = 0;

  function animateText() {
    gsap.to(title, {
      duration: 2,
      text: {
        value: "I'm a " + texts[index],
        delimiter: ""
      },
      ease: "power1.inOut",
      onComplete: () => {
        gsap.to({}, {
          duration: 2,
          onComplete: () => {
            index = (index + 1) % texts.length;
            animateText();
          }
        });
      }
    });
  }

  animateText();
});
