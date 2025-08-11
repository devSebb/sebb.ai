# Pin npm packages by running ./bin/importmap
pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers", preload: true
pin_all_from "vendor/javascript/utils", under: "utils", preload: true

# Pin individual JavaScript files 
pin "hero_animations", to: "app/javascript/hero_animations.js"
pin "specializations_animations", to: "app/javascript/specializations_animations.js"
pin "experience_animations", to: "app/javascript/experience_animations.js"
pin "path_animation", to: "app/javascript/path_animation.js"
pin "resume_animations", to: "app/javascript/resume_animations.js"
pin "projects_animations", to: "app/javascript/projects_animations.js"
pin "smooth_scroll", to: "app/javascript/smooth_scroll.js"
pin "gsap_setup", to: "app/javascript/gsap_setup.js"