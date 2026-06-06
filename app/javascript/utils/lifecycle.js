/**
 * Turbo-aware lifecycle for global interaction modules.
 *
 * Each module passes an `init` function that wires up its listeners and
 * returns a teardown function. `registerInteraction` then:
 *   - runs `init` once per page on `turbo:load` (which also fires on the
 *     initial load, so there is no separate "immediate" call to double-bind);
 *   - runs the returned teardown on `turbo:before-cache`, so window/document
 *     listeners never accumulate across Turbo navigations;
 *   - waits for GSAP to be ready before initialising.
 *
 * `init` may return nothing (e.g. when it bails out on touch devices); a
 * no-op teardown is used in that case.
 */
export function registerInteraction(init) {
  let teardown = null;

  function start() {
    if (teardown) return; // already initialised for this page
    const result = init();
    teardown = typeof result === "function" ? result : () => {};
  }

  function boot() {
    if (typeof gsap !== "undefined" && window.GSAP_READY) {
      start();
    } else {
      window.addEventListener("gsapInitialized", start, { once: true });
    }
  }

  function stop() {
    window.removeEventListener("gsapInitialized", start);
    if (teardown) {
      teardown();
      teardown = null;
    }
  }

  document.addEventListener("turbo:load", boot);
  document.addEventListener("turbo:before-cache", stop);
}
