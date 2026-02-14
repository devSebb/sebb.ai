# Pin npm packages by running ./bin/importmap
pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true

# Pin controllers directory
pin "controllers", to: "controllers/index.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/javascript/animations", under: "animations"

# Utility modules
pin "utils/text_splitter", to: "utils/text_splitter.js"
pin "utils/motion_library", to: "utils/motion_library.js"

# Animation modules
pin "hero_animations", to: "hero_animations.js", preload: true
pin "about_animations", to: "about_animations.js", preload: true
pin "projects_animations", to: "projects_animations.js", preload: true
pin "skills_animations", to: "skills_animations.js", preload: true
pin "experience_animations", to: "experience_animations.js", preload: true
pin "contact_animations", to: "contact_animations.js", preload: true
pin "project_detail_animations", to: "project_detail_animations.js", preload: true
pin "resume_animations", to: "resume_animations.js", preload: true
pin "smooth_scroll", to: "smooth_scroll.js", preload: true
pin "gsap_setup", to: "gsap_setup.js", preload: true

# Advanced interaction modules
pin "custom_cursor", to: "custom_cursor.js"
pin "magnetic", to: "magnetic.js"
pin "page_transitions", to: "page_transitions.js"
pin "preloader", to: "preloader.js"
pin "menu_animations", to: "menu_animations.js"
pin "floating_geometry", to: "floating_geometry.js"
