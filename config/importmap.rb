# Pin npm packages by running ./bin/importmap
pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers", preload: true
pin_all_from "vendor/javascript/utils", under: "utils", preload: true

# Pin individual JavaScript files
pin "hero_animations", preload: true
pin "specializations_animations", preload: true
pin "experience_animations", preload: true
pin "path_animation", preload: true
pin "resume_animations", preload: true
pin "projects_animations", preload: true
pin "smooth_scroll", preload: true
pin "gsap_setup", preload: true


pin "hero_animations", to: "hero_animations.js"
pin "specializations_animations", to: "specializations_animations.js"
pin "experience_animations", to: "experience_animations.js"
pin "path_animation", to: "path_animation.js"
pin "resume_animations", to: "resume_animations.js"
pin "projects_animations", to: "projects_animations.js"
pin "smooth_scroll", to: "smooth_scroll.js"
pin "gsap_setup", to: "gsap_setup.js"