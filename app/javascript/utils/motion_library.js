/**
 * Shared Motion Pattern Library
 * Semantic motion design system — every animation module imports from here.
 */

// ─── Core entrance patterns ───

export function fadeInUp(target, delay = 0) {
  return gsap.from(target, {
    y: 40, opacity: 0, ease: "power3.out", duration: 0.8, delay
  });
}

export function fadeInLeft(target, delay = 0) {
  return gsap.from(target, {
    x: -30, opacity: 0, ease: "power3.out", duration: 0.8, delay
  });
}

export function scaleIn(target, delay = 0) {
  return gsap.from(target, {
    scale: 0.9, opacity: 0, ease: "back.out(1.4)", duration: 0.6, delay
  });
}

export function maskReveal(target, delay = 0) {
  return gsap.from(target, {
    clipPath: "inset(0 100% 0 0)", duration: 0.8,
    ease: "power4.inOut", delay
  });
}

export function charStagger(chars, delay = 0) {
  return gsap.from(chars, {
    y: 80, opacity: 0, rotationX: -90,
    stagger: 0.03, duration: 1.0, ease: "back.out(1.7)", delay
  });
}

export function wordStagger(words, delay = 0) {
  return gsap.from(words, {
    y: 40, opacity: 0,
    stagger: 0.05, duration: 0.8, ease: "power3.out", delay
  });
}

// ─── Scroll-driven patterns ───

export function borderDraw(target) {
  return gsap.from(target, {
    scaleX: 0, transformOrigin: "left center",
    duration: 0.6, ease: "power2.inOut"
  });
}

export function svgStrokeDraw(target) {
  const length = target.getTotalLength();
  gsap.set(target, { strokeDasharray: length, strokeDashoffset: length });
  return gsap.to(target, { strokeDashoffset: 0, ease: "none" });
}

// ─── Hover patterns ───

export function hoverLift(el) {
  const tl = gsap.timeline({ paused: true });
  tl.to(el, { y: -5, scale: 1.02, duration: 0.3, ease: "power2.out" });
  el.addEventListener("mouseenter", () => tl.play());
  el.addEventListener("mouseleave", () => tl.reverse());
  return tl;
}

// ─── Reduced motion check ───

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
