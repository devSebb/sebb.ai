# Pin npm packages by running ./bin/importmap
pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true

# Pin controllers directory
pin "controllers", to: "controllers/index.js"
pin_all_from "app/javascript/controllers", under: "controllers"

# Pin individual JavaScript files
pin "hero_animations", to: "hero_animations.js"
pin "specializations_animations", to: "specializations_animations.js"
pin "experience_animations", to: "experience_animations.js"
pin "path_animation", to: "path_animation.js"
pin "resume_animations", to: "resume_animations.js"
pin "projects_animations", to: "projects_animations.js"
pin "smooth_scroll", to: "smooth_scroll.js"
pin "gsap_setup", to: "gsap_setup.js"