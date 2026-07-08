// Hero dot grid — an architectural floor plan drawn on canvas.
// Dots brighten toward the accent and drift toward the cursor within an
// influence radius. Static (single draw, no rAF) on touch and reduced motion.

const SPACING = 30;
const INFLUENCE = 240;
const DOT_SIZE = 1.5;
const BASE_ALPHA = 0.07;
const MAX_ALPHA = 0.9;
const MAX_SHIFT = 16;
const MAX_GROW = 2.2;
const BASE = { r: 232, g: 232, b: 232 };
const ACCENT = { r: 14, g: 215, b: 98 };

export function createDotGrid(section) {
  const canvas = section.querySelector("[data-hero-grid]");
  if (!canvas) return () => {};

  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const interactive = window.matchMedia("(pointer: fine)").matches && !reduced;

  let dots = [];
  let raf = null;
  let inView = false;
  let width = 0;
  let height = 0;
  const pointer = { x: -9999, y: -9999 };

  function buildDots() {
    dots = [];
    const cols = Math.max(1, Math.floor(width / SPACING));
    const rows = Math.max(1, Math.floor(height / SPACING));
    const offsetX = (width - (cols - 1) * SPACING) / 2;
    const offsetY = (height - (rows - 1) * SPACING) / 2;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = offsetX + i * SPACING;
        const y = offsetY + j * SPACING;
        dots.push({ ox: x, oy: y, x, y, a: BASE_ALPHA, m: 0 });
      }
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildDots();
    if (!interactive) drawStatic();
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `rgba(${BASE.r},${BASE.g},${BASE.b},${BASE_ALPHA})`;
    const half = DOT_SIZE / 2;
    for (const d of dots) {
      ctx.fillRect(d.ox - half, d.oy - half, DOT_SIZE, DOT_SIZE);
    }
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    const r2 = INFLUENCE * INFLUENCE;
    const half = DOT_SIZE / 2;
    for (const d of dots) {
      const dx = d.ox - pointer.x;
      const dy = d.oy - pointer.y;
      const dist2 = dx * dx + dy * dy;
      let tx = d.ox;
      let ty = d.oy;
      let ta = BASE_ALPHA;
      let tm = 0;
      if (dist2 < r2) {
        const dist = Math.sqrt(dist2) || 1;
        const force = 1 - dist / INFLUENCE;
        tx = d.ox + (dx / dist) * force * MAX_SHIFT;
        ty = d.oy + (dy / dist) * force * MAX_SHIFT;
        ta = BASE_ALPHA + force * (MAX_ALPHA - BASE_ALPHA);
        tm = force;
      }
      d.x += (tx - d.x) * 0.14;
      d.y += (ty - d.y) * 0.14;
      d.a += (ta - d.a) * 0.14;
      d.m += (tm - d.m) * 0.14;
      const r = (BASE.r + (ACCENT.r - BASE.r) * d.m) | 0;
      const g = (BASE.g + (ACCENT.g - BASE.g) * d.m) | 0;
      const b = (BASE.b + (ACCENT.b - BASE.b) * d.m) | 0;
      const size = DOT_SIZE + d.m * MAX_GROW;
      ctx.fillStyle = `rgba(${r},${g},${b},${d.a.toFixed(3)})`;
      ctx.fillRect(d.x - size / 2, d.y - size / 2, size, size);
    }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (!interactive || raf !== null) return;
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    if (raf !== null) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  }

  const onMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  };

  const onResize = () => {
    resize();
  };

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) {
      start();
    } else {
      stop();
    }
  });

  resize();
  observer.observe(section);
  window.addEventListener("resize", onResize);
  if (interactive) {
    window.addEventListener("mousemove", onMove, { passive: true });
  }

  return () => {
    stop();
    observer.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", onMove);
  };
}
