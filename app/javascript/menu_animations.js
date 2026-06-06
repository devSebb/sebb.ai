// Menu overlay — accessible toggle with clip-path animation

import { registerInteraction } from "utils/lifecycle";

const FOCUSABLE = "a[href], button:not([disabled])";

function init() {
  if (typeof gsap === "undefined") return null;

  const toggle = document.querySelector("[data-nav-toggle]");
  const overlay = document.querySelector("[data-menu-overlay]");
  const main = document.querySelector("main");
  const links = overlay ? overlay.querySelectorAll("[data-menu-link]") : [];
  if (!toggle || !overlay) return null;

  let isOpen = false;
  let keydownBound = false;

  // Focus trap spans the toggle (which acts as the close control) plus every
  // focusable element inside the overlay, so keyboard focus can't escape to
  // the backdrop while the menu is open.
  function trapItems() {
    return [ toggle, ...overlay.querySelectorAll(FOCUSABLE) ];
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      closeMenu();
      return;
    }
    if (e.key !== "Tab") return;

    const items = trapItems();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function bindKeydown() {
    if (keydownBound) return;
    document.addEventListener("keydown", onKeydown);
    keydownBound = true;
  }

  function unbindKeydown() {
    if (!keydownBound) return;
    document.removeEventListener("keydown", onKeydown);
    keydownBound = false;
  }

  function openMenu() {
    isOpen = true;
    overlay.classList.add("is-open");
    overlay.inert = false;
    if (main) main.inert = true;
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");

    gsap.timeline()
      .to(overlay, {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.6,
        ease: "power4.inOut"
      })
      .from(links, {
        y: 40, opacity: 0,
        stagger: 0.08, duration: 0.4, ease: "power3.out"
      }, "-=0.2");

    bindKeydown();
    if (links[0]) links[0].focus();
  }

  function closeMenu({ returnFocus = true } = {}) {
    isOpen = false;
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    if (main) main.inert = false;
    unbindKeydown();

    gsap.timeline({
      onComplete: () => {
        overlay.classList.remove("is-open");
        overlay.inert = true;
      }
    })
      .to(links, {
        y: -20, opacity: 0,
        stagger: 0.04, duration: 0.2, ease: "power2.in"
      })
      .to(overlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.5,
        ease: "power4.inOut"
      }, "-=0.1");

    if (returnFocus) toggle.focus();
  }

  function onToggle() {
    isOpen ? closeMenu() : openMenu();
  }

  // Links navigate (Turbo) away, so don't bounce focus back to the toggle.
  function onLinkClick() {
    if (isOpen) closeMenu({ returnFocus: false });
  }

  toggle.addEventListener("click", onToggle);
  links.forEach((link) => link.addEventListener("click", onLinkClick));

  return () => {
    toggle.removeEventListener("click", onToggle);
    links.forEach((link) => link.removeEventListener("click", onLinkClick));
    unbindKeydown();
    // Snap back to a clean, closed state so a cached snapshot never restores
    // a half-open, focus-trapping menu.
    if (main) main.inert = false;
    overlay.classList.remove("is-open");
    overlay.inert = true;
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    gsap.set(overlay, { clearProps: "clipPath" });
  };
}

registerInteraction(init);

export { init };
