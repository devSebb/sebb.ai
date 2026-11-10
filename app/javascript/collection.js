// The collection reel and the doors into the rooms.
//
// Reel: whichever product crosses the middle of the screen becomes active. The
// section takes that product's colours, and the sticky stage first shows its
// still, then swaps in its live film (an iframe of /projects/<slug>/film).
// Only one film is ever loaded at a time, and none on small screens.
//
// Doors: any [data-door] link floods the screen with the room's colour from
// the point that was clicked, then opens the room.

const DEFAULTS = { bg: "#0A0A0A", fg: "#E8E8E8", muted: "#8A8A86", accent: "#0ED762" };

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function openDoor(event) {
  const link = event.target.closest("[data-door]");
  if (!link || event.defaultPrevented) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  if (reducedMotion()) return;

  event.preventDefault();
  const flood = document.createElement("div");
  flood.className = "door-flood";
  flood.style.background = link.dataset.doorColor || DEFAULTS.bg;
  flood.style.setProperty("--x", `${event.clientX || window.innerWidth / 2}px`);
  flood.style.setProperty("--y", `${event.clientY || window.innerHeight / 2}px`);
  document.body.appendChild(flood);
  // Two frames so the starting clip-path is painted before it grows.
  requestAnimationFrame(() => requestAnimationFrame(() => flood.classList.add("is-open")));
  window.setTimeout(() => { window.location.href = link.href; }, 620);
}

// A flood left on screen would cover the page if the visitor comes back
// through the browser's back/forward cache.
function clearFloods() {
  document.querySelectorAll(".door-flood").forEach((flood) => flood.remove());
}

function init(section) {
  const items = Array.from(section.querySelectorAll("[data-reel-item]"));
  const stage = section.querySelector("[data-reel-stage]");
  const still = section.querySelector("[data-reel-still]");
  const frame = section.querySelector("[data-reel-frame]");
  const tag = section.querySelector("[data-reel-tag]");
  const wide = window.matchMedia("(min-width: 1024px)");
  let active = null;
  let filmTimer = 0;

  function paint(colors) {
    section.style.setProperty("--rb", colors.bg);
    section.style.setProperty("--rt", colors.fg);
    section.style.setProperty("--rm", colors.muted);
    section.style.setProperty("--ra", colors.accent);
  }

  function loadFilm(item) {
    if (!frame || !wide.matches || reducedMotion()) return;
    frame.classList.remove("is-live");
    frame.onload = () => { if (active === item) frame.classList.add("is-live"); };
    frame.src = item.dataset.film;
  }

  function activate(item) {
    if (item === active) return;
    active = item;
    items.forEach((other) => other.classList.toggle("is-active", other === item));
    window.clearTimeout(filmTimer);

    if (!item) {
      paint(DEFAULTS);
      return;
    }

    paint({ bg: item.dataset.bg, fg: item.dataset.fg, muted: item.dataset.muted, accent: item.dataset.accent });
    if (stage) {
      stage.href = item.dataset.href;
      stage.dataset.doorColor = item.dataset.bg;
    }
    if (still) still.src = item.dataset.still;
    if (tag) tag.textContent = item.dataset.tag;
    if (frame) frame.classList.remove("is-live");
    // Wait until the visitor settles on a product before loading its film.
    filmTimer = window.setTimeout(() => loadFilm(item), 450);
  }

  // A zero-height band across the middle of the viewport: at most one item
  // touches it at a time, and none do once the section has scrolled away.
  const touching = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) touching.add(entry.target);
      else touching.delete(entry.target);
    });
    activate(items.find((item) => touching.has(item)) || null);
  }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });
  items.forEach((item) => observer.observe(item));

  document.addEventListener("click", openDoor);
  window.addEventListener("pageshow", clearFloods);

  return {
    destroy() {
      observer.disconnect();
      window.clearTimeout(filmTimer);
      document.removeEventListener("click", openDoor);
      window.removeEventListener("pageshow", clearFloods);
      if (frame) frame.removeAttribute("src");
    }
  };
}

export { init };
