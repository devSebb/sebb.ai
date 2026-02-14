// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import { register, initScope, destroyAll } from "animations/registry"
import { init as initHero } from "hero_animations"
import { init as initAbout } from "about_animations"
import { init as initProjects } from "projects_animations"
import { init as initSkills } from "skills_animations"
import { init as initExperience } from "experience_animations"
import { init as initContact } from "contact_animations"
import { init as initProjectDetail } from "project_detail_animations"
import { init as initResume } from "resume_animations"
import "smooth_scroll"
import "gsap_setup"
import "custom_cursor"
import "magnetic"
import "page_transitions"
import "preloader"
import "menu_animations"
import "floating_geometry"

register("hero", { init: initHero })
register("about", { init: initAbout })
register("projects", { init: initProjects })
register("skills", { init: initSkills })
register("experience", { init: initExperience })
register("contact", { init: initContact })
register("project-detail", { init: initProjectDetail })
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
