// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

// CRITICAL: Initialize GSAP system on Turbo events
document.addEventListener('turbo:load', () => {
  console.log('Turbo loaded - reinitializing GSAP system');
  if (typeof gsap !== 'undefined' && window.GSAP_READY) {
    window.dispatchEvent(new CustomEvent('gsapInitialized'));
  }
});

// Clean up before Turbo caches the page
document.addEventListener('turbo:before-cache', () => {
  console.log('Turbo before cache - cleaning up ScrollTrigger');
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
});

// Import animations - these will be loaded individually by importmap
import "hero_animations"
import "specializations_animations"
import "experience_animations"
import "path_animation"
import "resume_animations"
import "projects_animations"

// Import smooth scrolling
import "smooth_scroll"

// Import GSAP setup
import "gsap_setup"
