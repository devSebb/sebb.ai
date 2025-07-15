import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="left-sidebar"
export default class extends Controller {
  static targets = ["content"]

  toggle() {
    this.element.classList.toggle('collapsed')
    if (this.element.classList.contains('collapsed')) {
      this.contentTarget.classList.add('w-0')
      this.contentTarget.classList.remove('w-64')
    } else {
      this.contentTarget.classList.add('w-64')
      this.contentTarget.classList.remove('w-0')
    }
  }
}
