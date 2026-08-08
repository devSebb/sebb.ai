import { splitByChars } from "utils/text_splitter";
import { charStagger, EASE, DUR, prefersReducedMotion } from "utils/motion_library";

function init(section) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReducedMotion()) {
    return { destroy() {} };
  }

  // Non-GSAP cleanup refs (marquee listeners, resize, cloned slides)
  let galleryCleanup = null;

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

    // ─── Gallery: auto-rotating marquee with 1:1 drag ───
    // One position value drives the strip: it advances on its own at a slow drift,
    // follows the pointer exactly while dragging, then coasts that momentum back
    // into the drift. Slides are cloned so the position can wrap seamlessly —
    // there is no end to hit, so no image is ever left half-cut.
    const viewport = section.querySelector("[data-gallery-viewport]");
    const track = section.querySelector("[data-gallery-track]");
    const slides = Array.from(section.querySelectorAll("[data-gallery-slide]"));

    if (viewport && track && slides.length > 0) {
      const DRIFT = 40;        // px/sec — ambient auto-rotation
      const FRICTION = 3.5;    // how fast flung momentum decays back to the drift
      const MAX_FLING = 2500;  // px/sec cap, so a violent swipe stays readable

      let clones = [];
      let distance = 0;    // width of one full set — the wrap period
      let pos = 0;         // px travelled; larger = further left
      let momentum = 0;    // px/sec carried over from a drag release
      let held = false;    // pointer down on the strip
      let visible = true;  // strip inside the viewport
      let wrapPos = (v) => v;

      function addCloneSet() {
        slides.forEach((slide) => {
          const clone = slide.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          clone.dataset.galleryClone = "true";
          track.appendChild(clone);
          clones.push(clone);
        });
      }

      function render() {
        gsap.set(track, { x: -wrapPos(pos) });
      }

      function build() {
        clones.forEach((c) => c.remove());
        clones = [];

        // Always duplicate at least one full set (that's what makes the wrap
        // seamless), then keep adding until the strip covers 2× the viewport so
        // there is never a visible gap at the trailing edge.
        addCloneSet();
        let guard = 0;
        while (track.scrollWidth < viewport.clientWidth * 2 && guard < 8) {
          addCloneSet();
          guard += 1;
        }

        // One set-width = distance from the first slide to its first clone.
        distance = clones[0].offsetLeft - slides[0].offsetLeft;
        if (distance <= 0) {
          wrapPos = (v) => v;
          pos = 0;
        } else {
          wrapPos = gsap.utils.wrap(0, distance);
          pos = wrapPos(pos);
        }
        render();
      }

      // Batch rebuilds — image loads and resizes arrive in bursts.
      let buildFrame = null;
      function scheduleBuild() {
        if (buildFrame) cancelAnimationFrame(buildFrame);
        buildFrame = requestAnimationFrame(() => {
          buildFrame = null;
          build();
        });
      }

      // Image widths drive the wrap period — rebuild as they resolve so a slow
      // image can't leave the loop measured short (the old cut-off last frame).
      const imageHandlers = [];
      Array.from(track.querySelectorAll("img"))
        .filter((img) => !img.complete)
        .forEach((img) => {
          img.addEventListener("load", scheduleBuild);
          img.addEventListener("error", scheduleBuild);
          imageHandlers.push(img);
        });

      build();

      // Ticker: while held the pointer owns the position outright; otherwise the
      // strip drifts, plus whatever fling momentum is still decaying.
      function tick(time, deltaMs) {
        if (held || distance <= 0) return;
        if (!visible && Math.abs(momentum) < 1) return;

        const dt = Math.min(deltaMs, 50) / 1000; // clamp tab-switch spikes
        if (momentum !== 0) {
          pos += momentum * dt;
          momentum *= Math.exp(-FRICTION * dt);
          if (Math.abs(momentum) < 1) momentum = 0;
        }
        pos += DRIFT * dt;
        pos = wrapPos(pos);
        render();
      }
      gsap.ticker.add(tick);

      // ── Drag: 1:1 with the pointer, with velocity carried into the release ──
      let pointerId = null;
      let lastX = 0;
      let lastMoveTime = 0;
      let dragged = false;

      function onPointerDown(e) {
        if (e.button !== undefined && e.button !== 0) return;
        held = true;
        dragged = false;
        momentum = 0;
        pointerId = e.pointerId;
        lastX = e.clientX;
        lastMoveTime = e.timeStamp;
        viewport.classList.add("is-dragging");
        if (viewport.setPointerCapture) {
          try { viewport.setPointerCapture(e.pointerId); } catch (_) { /* no-op */ }
        }
      }

      function onPointerMove(e) {
        if (!held || e.pointerId !== pointerId || distance <= 0) return;

        const dx = e.clientX - lastX;
        if (dx === 0) return;
        if (Math.abs(dx) > 2) dragged = true;

        // Dragging left (negative dx) pulls the strip forward.
        pos = wrapPos(pos - dx);
        render();

        // Instantaneous velocity, smoothed so a single jittery frame can't
        // dominate the fling.
        const dt = (e.timeStamp - lastMoveTime) / 1000;
        if (dt > 0) {
          const velocity = gsap.utils.clamp(-MAX_FLING, MAX_FLING, -dx / dt);
          momentum = momentum * 0.7 + velocity * 0.3;
        }
        lastX = e.clientX;
        lastMoveTime = e.timeStamp;
      }

      function onPointerUp(e) {
        if (!held || (pointerId !== null && e.pointerId !== pointerId)) return;
        held = false;
        pointerId = null;
        viewport.classList.remove("is-dragging");

        // A press with no movement is a deliberate hold-to-pause, not a fling.
        if (!dragged) momentum = 0;
        // Stale velocity from a drag that stopped before release shouldn't fling.
        else if (e.timeStamp - lastMoveTime > 120) momentum = 0;
      }

      viewport.addEventListener("pointerdown", onPointerDown);
      viewport.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);

      // Don't burn frames while the strip is off-screen.
      const visibilityTrigger = ScrollTrigger.create({
        trigger: viewport,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => { visible = self.isActive; }
      });
      visible = visibilityTrigger.isActive;

      const resizeHandler = scheduleBuild;
      window.addEventListener("resize", resizeHandler);

      galleryCleanup = function cleanup() {
        gsap.ticker.remove(tick);
        viewport.removeEventListener("pointerdown", onPointerDown);
        viewport.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
        window.removeEventListener("resize", resizeHandler);
        imageHandlers.forEach((img) => {
          img.removeEventListener("load", scheduleBuild);
          img.removeEventListener("error", scheduleBuild);
        });
        if (buildFrame) cancelAnimationFrame(buildFrame);
        clones.forEach((c) => c.remove());
        clones = [];
        viewport.classList.remove("is-dragging");
        gsap.set(track, { x: 0 });
      };
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
      // Kill non-GSAP listeners and remove cloned slides first
      if (galleryCleanup) galleryCleanup();
      // ctx.revert() kills all GSAP tweens + ScrollTriggers
      ctx.revert();
    }
  };
}

export { init };
