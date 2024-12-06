document.addEventListener("DOMContentLoaded", function() {
  gsap.registerPlugin(TextPlugin);
  const title = document.querySelector("#hero-text");

  if (!title) return;


  const texts = [
    "software developer",
    "web designer",
    "mobile app designer",
    "product manager",
    "business developer",
    "data analyst"
  ];
  let index = 0;

  function animateText() {
    gsap.to(title, {
      duration: 2,
      text: {
        value: "I'm a " + texts[index],
        delimiter: "",
        type: "diff"
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
