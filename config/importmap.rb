# Pin npm packages by running ./bin/importmap
pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true

# Pin controllers directory
pin "controllers", to: "controllers/index.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/javascript/animations", under: "animations"

# Pin individual JavaScript files
pin "hero_animations", to: "hero_animations.js", preload: true
pin "specializations_animations", to: "specializations_animations.js", preload: true
pin "experience_animations", to: "experience_animations.js", preload: true
pin "resume_animations", to: "resume_animations.js", preload: true
pin "projects_animations", to: "projects_animations.js", preload: true
pin "smooth_scroll", to: "smooth_scroll.js", preload: true
pin "gsap_setup", to: "gsap_setup.js", preload: true