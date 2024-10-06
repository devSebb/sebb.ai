gsap.registerPlugin(ScrollTrigger);

// Timeline Animations
gsap.utils.toArray('.timeline-item').forEach((item, i) => {
  gsap.fromTo(item, { opacity: 0, y: 50 }, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    }
  });
});

// Skill Cards Hover Effect
gsap.utils.toArray('.group').forEach((card) => {
  let hover = gsap.to(card.querySelector('.absolute'), {
    opacity: 1,
    paused: true,
    duration: 0.5,
    ease: 'power1.inOut'
  });

  card.addEventListener('mouseenter', () => hover.play());
  card.addEventListener('mouseleave', () => hover.reverse());
});
