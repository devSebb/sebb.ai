import { Controller } from "@hotwired/stimulus"

// Flash toast: animated entrance/exit, auto-dismiss, manual close.
// Lifecycle is managed by Stimulus (connect/disconnect), so it is
// Turbo-aware with no leaked listeners. GSAP is used when available,
// otherwise the toast still shows/hides instantly.
export default class extends Controller {
  static values = { dismissAfter: { type: Number, default: 6000 } }

  connect() {
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    this.animateIn()

    if (this.dismissAfterValue > 0) {
      this.timeout = setTimeout(() => this.close(), this.dismissAfterValue)
    }

    // Never let a toast get frozen into Turbo's page cache and reappear
    // on a back/forward navigation.
    this.beforeCache = () => this.element.remove()
    document.addEventListener("turbo:before-cache", this.beforeCache)
  }

  disconnect() {
    clearTimeout(this.timeout)
    document.removeEventListener("turbo:before-cache", this.beforeCache)
  }

  animateIn() {
    if (this.reduced || typeof gsap === "undefined") return
    gsap.from(this.element, { x: 32, autoAlpha: 0, duration: 0.5, ease: "power3.out" })
  }

  close() {
    clearTimeout(this.timeout)

    if (this.reduced || typeof gsap === "undefined") {
      this.element.remove()
      return
    }

    gsap.to(this.element, {
      x: 32,
      autoAlpha: 0,
      duration: 0.4,
      ease: "power3.in",
      onComplete: () => this.element.remove()
    })
  }
}
