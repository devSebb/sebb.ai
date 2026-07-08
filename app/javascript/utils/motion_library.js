/**
 * Shared Motion Pattern Library
 * One easing voice for the whole exhibition. Every animation module pulls
 * its eases/durations from here — no ad-hoc values in section modules.
 */

// ─── House motion tokens (mirror config/tailwind.config.js) ───

export const EASE = "expo.out";          // entrances
export const EASE_INOUT = "expo.inOut";  // wipes / masks
export const DUR = { fast: 0.3, normal: 0.6, slow: 0.9 };

// ─── Core entrance patterns ───

export function fadeInUp(target, delay = 0) {
  return gsap.from(target, {
    y: 40, opacity: 0, ease: EASE, duration: DUR.normal, delay
  });
}

// Chars rise out of the baseline — masked-reveal feel without clip hacks.
export function charStagger(chars, delay = 0) {
  return gsap.from(chars, {
    yPercent: 105, opacity: 0,
    stagger: 0.02, duration: DUR.slow, ease: EASE, delay
  });
}

export function wordStagger(words, delay = 0) {
  return gsap.from(words, {
    y: 40, opacity: 0,
    stagger: 0.04, duration: DUR.normal, ease: EASE, delay
  });
}

// Block-level wipe reveal (safe on whole elements; no text splitting needed).
export function clipReveal(target, delay = 0) {
  return gsap.from(target, {
    clipPath: "inset(0 100% 0 0)", duration: DUR.normal,
    ease: EASE_INOUT, delay
  });
}

export function borderDraw(target) {
  return gsap.from(target, {
    scaleX: 0, transformOrigin: "left center",
    duration: DUR.normal, ease: EASE_INOUT
  });
}

// ─── Reduced motion check ───

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
