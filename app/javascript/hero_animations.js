import { splitByChars } from "utils/text_splitter";
import { charStagger, EASE, prefersReducedMotion } from "utils/motion_library";
import { createDotGrid } from "hero_grid";

function init(section) {
  if (typeof gsap === "undefined" || prefersReducedMotion()) {
    return { destroy() {} };
  }

  const destroyGrid = createDotGrid(section);
  const cleanups = [];

  const ctx = gsap.context(() => {
    const titleEl = section.querySelector("[data-hero-title]");
    const meta = section.querySelector(".hero-meta");
    const role = section.querySelector(".hero-role");
    const roleTrack = section.querySelector("[data-role-track]");
    const tagline = section.querySelector(".hero-tagline");
    const scrollCue = section.querySelector(".hero-scroll-cue");
    const titleFront = section.querySelector(".hero-title-front");
    const titleBack = section.querySelector(".hero-title-back");

    // Split title into characters
    let chars = [];
    if (titleEl) {
      chars = splitByChars(titleEl);
    }

    // Variable-weight wave — chars thin out, lift, and catch the accent
    // under the cursor's flashlight. Enabled after the entrance settles so
    // the two never fight over the same transforms.
    if (chars.length && window.matchMedia("(pointer: fine)").matches) {
      const weightChars = Array.from(chars);
      const tint = gsap.utils.interpolate("#E8E8E8", "#0ED762");
      const RADIUS = 340;

      const onMove = (e) => {
        if (!section.dataset.waveReady) return;
        weightChars.forEach((char) => {
          const r = char.getBoundingClientRect();
          const dist = Math.hypot(
            e.clientX - (r.left + r.width / 2),
            e.clientY - (r.top + r.height / 2)
          );
          const force = Math.max(0, 1 - dist / RADIUS);
          char.style.fontVariationSettings = `'wght' ${Math.round(800 - force * 400)}`;
          char.style.transform = `translateY(${(-14 * force).toFixed(1)}px)`;
          char.style.color = force > 0.02 ? tint(Math.min(1, force * 0.9)) : "";
        });
      };
      const onLeave = () => {
        weightChars.forEach((char) => {
          char.style.fontVariationSettings = "";
          char.style.transform = "";
          char.style.color = "";
        });
      };
      section.addEventListener("mousemove", onMove, { passive: true });
      section.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        section.removeEventListener("mousemove", onMove);
        section.removeEventListener("mouseleave", onLeave);
      });
    }

    // Rotating role — masked roll through the titles (last item clones the first)
    if (roleTrack && roleTrack.children.length > 1) {
      const items = roleTrack.children.length;
      const step = 100 / items;
      const rollTl = gsap.timeline({ repeat: -1, delay: 3 });
      for (let i = 1; i < items; i++) {
        rollTl.to(roleTrack, {
          yPercent: -step * i, duration: 0.7, ease: "expo.inOut"
        }, "+=2.2");
      }
      rollTl.set(roleTrack, { yPercent: 0 }, "+=2.2");
    }

    // Entrance timeline — plays after preloader
    const entranceTl = gsap.timeline({
      delay: window.__preloaderComplete ? 0 : 2.2,
      onComplete: () => {
        section.dataset.waveReady = "true";
        section.classList.add("hero-wave-ready");
      }
    });

    if (meta) {
      entranceTl.from(meta, {
        y: 20, opacity: 0, duration: 0.8, ease: EASE
      });
    }

    if (chars.length) {
      entranceTl.add(charStagger(chars), "-=0.4");
    }

    if (role) {
      entranceTl.from(role, {
        y: 20, opacity: 0, duration: 0.7, ease: EASE
      }, "-=0.5");
    }

    if (tagline) {
      entranceTl.from(tagline, {
        y: 20, opacity: 0, duration: 0.8, ease: EASE
      }, "-=0.3");
    }

    if (scrollCue) {
      entranceTl.from(scrollCue, {
        opacity: 0, duration: 0.6
      });
    }

    // Scroll-driven parallax (pinned hero)
    if (typeof ScrollTrigger !== "undefined") {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          id: "HERO_PIN",
          trigger: section,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1
        }
      });

      if (titleFront) {
        scrollTl.to(titleFront, { yPercent: -20, ease: "none" }, 0);
      }
      if (titleBack) {
        scrollTl.to(titleBack, { yPercent: -8, ease: "none" }, 0);
      }

      // Fade out content as user scrolls past
      scrollTl.to(section.children, {
        opacity: 0, y: -60, ease: "none"
      }, 0.7);
    }
  }, section);

  return {
    destroy() {
      destroyGrid();
      cleanups.forEach((remove) => remove());
      ctx.revert();
    }
  };
}

export { init };
