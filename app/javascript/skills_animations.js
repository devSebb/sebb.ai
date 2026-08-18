import { splitByChars } from "utils/text_splitter";
import { prefersReducedMotion } from "utils/motion_library";

function init(section) {
  if (typeof gsap === "undefined") {
    return { destroy() {} };
  }

  const reducedMotion = prefersReducedMotion();
  const ctx = gsap.context(() => {
    const categories = section.querySelectorAll(".skill-category");
    const items = section.querySelectorAll(".skill-item");

    // Scroll-triggered entrance animations (skip when reduced motion preferred)
    if (!reducedMotion && typeof ScrollTrigger !== "undefined") {
    // Category entrance with mask + scale + fade
    gsap.from(categories, {
      clipPath: "inset(100% 0 0 0)",
      scale: 0.95, opacity: 0,
      stagger: 0.15, duration: 0.8, ease: "power3.out",
      scrollTrigger: {
        id: "SKILLS_ENTRANCE",
        trigger: section,
        start: "top 75%"
      }
    });

    // Category headings — character animation
    const headings = section.querySelectorAll(".skill-cat-heading");
    headings.forEach((heading) => {
      const chars = splitByChars(heading);
      gsap.from(chars, {
        y: 40, opacity: 0,
        stagger: 0.02, duration: 0.6, ease: "power3.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 85%"
        }
      });
    });

    // Skill items stagger
    gsap.from(items, {
      x: -20, opacity: 0,
      stagger: 0.03, duration: 0.5, ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 60%"
      }
    });
    }

    // ── Toolwall: entrance wave + discipline filter ──
    const grid = section.querySelector("[data-toolwall-grid]");
    const cells = Array.from(section.querySelectorAll("[data-toolwall-item]"));
    const chips = Array.from(section.querySelectorAll("[data-toolwall-filter]"));

    if (grid && cells.length) {
      // Entrance — a wave rolling out from the centre of the lattice.
      if (!reducedMotion && typeof ScrollTrigger !== "undefined") {
        gsap.from(cells, {
          opacity: 0, scale: 0.9, y: 12,
          duration: 0.5, ease: "power2.out",
          stagger: { each: 0.012, grid: "auto", from: "center" },
          scrollTrigger: {
            id: "SKILLS_TOOLWALL",
            trigger: grid,
            start: "top 85%"
          }
        });
      }

      let activeFilter = "all";

      function matches(cell, filter) {
        return filter === "all" || cell.dataset.group === filter;
      }

      function applyFilter(filter) {
        if (filter === activeFilter) return;
        activeFilter = filter;

        chips.forEach((chip) => {
          const on = chip.dataset.toolwallFilter === filter;
          chip.classList.toggle("is-active", on);
          chip.setAttribute("aria-pressed", on ? "true" : "false");
        });

        const show = cells.filter((c) => matches(c, filter));
        const hide = cells.filter((c) => !matches(c, filter));

        if (reducedMotion) {
          hide.forEach((c) => c.classList.add("is-hidden"));
          show.forEach((c) => c.classList.remove("is-hidden"));
          return;
        }

        gsap.killTweensOf(cells);

        // Reveal has to wait for the outgoing cells to leave the flow, or the
        // lattice re-knits underneath the incoming stagger and everything jumps.
        const reveal = () => {
          show.forEach((c) => c.classList.remove("is-hidden"));
          gsap.fromTo(
            show,
            { opacity: 0, scale: 0.92 },
            {
              opacity: 1, scale: 1,
              duration: 0.35, ease: "power2.out",
              stagger: { each: 0.015, grid: "auto", from: "start" },
              clearProps: "transform"
            }
          );
        };

        if (hide.length) {
          gsap.to(hide, {
            opacity: 0, scale: 0.92,
            duration: 0.18, ease: "power2.in",
            onComplete: () => {
              hide.forEach((c) => c.classList.add("is-hidden"));
              reveal();
            }
          });
        } else {
          reveal();
        }
      }

      chips.forEach((chip) => {
        chip.addEventListener("click", () => applyFilter(chip.dataset.toolwallFilter));
      });
    }

  }, section);

  return {
    destroy() {
      ctx.revert();
    }
  };
}

export { init };
