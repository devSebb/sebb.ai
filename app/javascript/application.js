// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import { register, initScope, destroyAll } from "animations/registry"
import { init as initHero } from "hero_animations"
import { init as initSpecializations } from "specializations_animations"
import { init as initExperience } from "experience_animations"
import { init as initProjects } from "projects_animations"
import { init as initResume } from "resume_animations"
import "smooth_scroll"
import "gsap_setup"

register("hero", { init: initHero })
register("specializations", { init: initSpecializations })
register("experience", { init: initExperience })
register("projects", { init: initProjects })
register("resume", { init: initResume })

function initializeAnimations() {
  if (typeof gsap === "undefined" || !window.GSAP_READY) {
    window.addEventListener("gsapInitialized", () => initScope(document), { once: true })
    return
  }
  initScope(document)
}

document.addEventListener("turbo:load", initializeAnimations)
document.addEventListener("turbo:before-cache", () => {
  destroyAll()
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  }
})
