import { Controller } from "@hotwired/stimulus"

// Opens the browser's print dialog so the resume can be saved as a PDF.
// The print stylesheet (@media print) handles the ink-friendly layout.
export default class extends Controller {
  now() {
    window.print()
  }
}
