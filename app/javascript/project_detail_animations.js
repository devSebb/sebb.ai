import { splitByChars } from "utils/text_splitter";
import { charStagger, EASE, DUR, prefersReducedMotion } from "utils/motion_library";

function init(section) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReducedMotion()) {
    return { destroy() {} };
  }

  // Non-GSAP cleanup refs (Observer, resize, keydown)
  let galleryObserver = null;
  let galleryResizeHandler = null;
  let galleryKeyHandler = null;

  const ctx = gsap.context(() => {
    const heroImg = section.querySelector(".project-hero-img");
    const heroOverlay = section.querySelector(".project-hero-overlay");
    const title = section.querySelector(".project-detail-title");
    const metaCols = section.querySelectorAll(".project-meta-col");
    const descriptions = section.querySelectorAll(".project-description");
    const features = section.querySelectorAll(".project-feature");
    const navLinks = section.querySelectorAll(".project-nav-link");

    // Hero cinematic scroll-through
    if (heroImg) {
      gsap.timeline({
        scrollTrigger: {
          id: "PROJECT_DETAIL_HERO",
          trigger: ".project-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      })
      .to(heroImg, { yPercent: 30, scale: 1.1, ease: "none" }, 0)
      .to(heroOverlay, { opacity: 0.9, ease: "none" }, 0);
    }

    // Title entrance — character split
    if (title) {
      const chars = splitByChars(title);
      charStagger(chars, 0.3);
    }

    // Metadata reveal
    if (metaCols.length) {
      gsap.from(metaCols, {
        y: 20, opacity: 0, scale: 0.95,
        stagger: 0.1, duration: DUR.normal, ease: EASE,
        scrollTrigger: {
          trigger: ".project-metadata",
          start: "top 85%"
        }
      });
    }

    // Description paragraphs — staggered house reveal
    if (descriptions.length) {
      gsap.from(descriptions, {
        y: 30, opacity: 0, stagger: 0.12, duration: DUR.slow, ease: EASE,
        scrollTrigger: {
          trigger: descriptions[0],
          start: "top 80%"
        }
      });
    }

    // Features stagger
    if (features.length) {
      gsap.from(features, {
        y: 30, opacity: 0, stagger: 0.1, duration: DUR.normal, ease: EASE,
        scrollTrigger: {
          trigger: features[0],
          start: "top 85%"
        }
      });
    }

    // ─── Gallery: Cinematic horizontal scroll ───
    const viewport = section.querySelector("[data-gallery-viewport]");
    const track = section.querySelector("[data-gallery-track]");
    const slides = section.querySelectorAll("[data-gallery-slide]");
    const frames = section.querySelectorAll(".gallery-frame");
    const counter = section.querySelector("[data-gallery-counter]");
    const progressBar = section.querySelector("[data-gallery-progress]");
    const totalSlides = slides.length;

    if (viewport && track && totalSlides > 0) {
      let maxScroll = 0;
      let slideCenters = [];

      function updateBounds() {
        maxScroll = Math.max(0, track.scrollWidth - viewport.clientWidth);
        slideCenters = [];
        const trackRect = track.getBoundingClientRect();
        slides.forEach((slide) => {
          const rect = slide.getBoundingClientRect();
          const center = rect.left - trackRect.left + rect.width / 2;
          slideCenters.push(center);
        });
      }
      updateBounds();

      let scrollPos = 0;
      const xTo = gsap.quickTo(track, "x", { duration: 0.6, ease: "power3.out" });

      function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
      }

      // Find nearest slide to viewport center
      function getNearestSlideIndex() {
        const viewportCenter = viewport.clientWidth / 2;
        const currentOffset = Math.abs(scrollPos);
        let nearest = 0;
        let minDist = Infinity;
        slideCenters.forEach((center, i) => {
          const dist = Math.abs(center - currentOffset - viewportCenter);
          if (dist < minDist) {
            minDist = dist;
            nearest = i;
          }
        });
        return nearest;
      }

      // Snap to nearest slide center
      function snapToNearest() {
        if (maxScroll === 0) return;
        const idx = getNearestSlideIndex();
        const viewportCenter = viewport.clientWidth / 2;
        const target = clamp(-(slideCenters[idx] - viewportCenter), -maxScroll, 0);
        scrollPos = target;
        gsap.to(track, { x: target, duration: 0.5, ease: "power3.out" });
        updateUI();
      }

      // Staggered depth + gentle counter-parallax as the strip crosses the viewport
      slides.forEach((slide, i) => {
        gsap.set(slide, { y: i % 2 === 0 ? -12 : 12 });
      });
      gsap.to(slides, {
        y: (i) => (i % 2 === 0 ? 12 : -12),
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Entrance animation
      gsap.from(slides, {
        x: 100, opacity: 0,
        stagger: 0.08, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: viewport,
          start: "top 80%"
        }
      });

      // Update counter + progress + active glow
      function updateUI() {
        const progress = maxScroll > 0 ? Math.abs(scrollPos) / maxScroll : 0;
        if (progressBar) {
          gsap.set(progressBar, { width: `${clamp(progress * 100, 0, 100)}%` });
        }
        const activeIdx = getNearestSlideIndex();
        if (counter) {
          counter.textContent =
            `${String(activeIdx + 1).padStart(2, "0")} / ${String(totalSlides).padStart(2, "0")}`;
        }
        frames.forEach((f, i) => f.classList.toggle("is-active", i === activeIdx));
      }

      // Observer: wheel, drag, touch
      galleryObserver = Observer.create({
        target: viewport,
        type: "wheel,touch,pointer",
        onPress: () => { viewport.style.cursor = "grabbing"; },
        onRelease: () => {
          viewport.style.cursor = "grab";
          snapToNearest();
        },
        onChange: (self) => {
          const delta = self.deltaX || self.deltaY;

          // Wheel passthrough at boundaries
          if (self.event?.type?.includes("wheel")) {
            const atStart = scrollPos >= 0 && delta < 0;
            const atEnd = scrollPos <= -maxScroll && delta > 0;
            if (atStart || atEnd) return;
          }

          scrollPos = clamp(scrollPos - delta, -maxScroll, 0);
          xTo(scrollPos);
          updateUI();
        },
        tolerance: 10,
        preventDefault: true,
        lockAxis: false
      });

      // Keyboard navigation
      galleryKeyHandler = function onKey(e) {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        const rect = viewport.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          const dir = e.key === "ArrowRight" ? 1 : -1;
          const currentIdx = getNearestSlideIndex();
          const targetIdx = clamp(currentIdx + dir, 0, totalSlides - 1);
          const viewportCenter = viewport.clientWidth / 2;
          scrollPos = clamp(-(slideCenters[targetIdx] - viewportCenter), -maxScroll, 0);
          gsap.to(track, { x: scrollPos, duration: 0.5, ease: "power3.out" });
          updateUI();
          e.preventDefault();
        }
      };
      document.addEventListener("keydown", galleryKeyHandler);

      // Hover effects
      slides.forEach((slide, i) => {
        const frame = frames[i];
        if (!frame) return;
        slide.addEventListener("mouseenter", () => {
          gsap.to(frame, { scale: 1.03, duration: 0.4, ease: "back.out(1.7)" });
          frames.forEach((f, j) => {
            if (j !== i) gsap.to(f, { opacity: 0.7, duration: 0.3 });
          });
        });
        slide.addEventListener("mouseleave", () => {
          gsap.to(frame, { scale: 1, duration: 0.3 });
          frames.forEach((f) => gsap.to(f, { opacity: 1, duration: 0.3 }));
        });
      });

      // Resize handler
      galleryResizeHandler = function onResize() {
        updateBounds();
        scrollPos = clamp(scrollPos, -maxScroll, 0);
        gsap.set(track, { x: scrollPos });
        updateUI();
      };
      window.addEventListener("resize", galleryResizeHandler);
    }

    // Prev/next fade up
    if (navLinks.length) {
      gsap.from(navLinks, {
        y: 30, opacity: 0, stagger: 0.15, duration: 0.6, ease: "power2.out",
        scrollTrigger: {
          trigger: navLinks[0],
          start: "top 90%"
        }
      });
    }
  }, section);

  return {
    destroy() {
      // Kill non-GSAP listeners first
      if (galleryObserver) galleryObserver.kill();
      if (galleryResizeHandler) window.removeEventListener("resize", galleryResizeHandler);
      if (galleryKeyHandler) document.removeEventListener("keydown", galleryKeyHandler);
      // ctx.revert() kills all GSAP tweens + ScrollTriggers
      ctx.revert();
    }
  };
}

export { init };
