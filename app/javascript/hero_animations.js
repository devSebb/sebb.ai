// GSAP is loaded via CDN in the layout

function initHeroAnimations() {
  console.log("=== HERO ANIMATIONS INITIALIZING ===");
  console.log("GSAP object:", gsap);
  console.log("GSAP version:", gsap.version);
  
  const title = document.querySelector("#hero-text");

  if (!title) {
    console.error("Hero text element not found");
    return;
  }

  console.log("Hero text element found:", title);
  console.log("Current text content:", title.textContent);

  function startTextAnimation() {
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
      console.log("Animating text to:", texts[index]);
      
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
  }

  // Start the animation after a short delay
  setTimeout(startTextAnimation, 1000);
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroAnimations);
} else {
  initHeroAnimations();
}
