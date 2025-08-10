// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

// GSAP is loaded via CDN in the layout, so we can use it directly
// Import animations - these will be bundled by esbuild in production
import "./hero_animations"
import "./specializations_animations"
import "./experience_animations"
import "./path_animation"
import "./resume_animations"
import "./projects_animations"

// Import smooth scrolling
import "./smooth_scroll"

// Import GSAP setup
import "./gsap_setup"
