/**
 * Lightweight SplitText replacement.
 * Splits element text into <span> wrappers for character/word-level GSAP animation.
 * Preserves aria-label for accessibility.
 */

export function splitByChars(el) {
  const text = el.textContent;
  el.setAttribute("aria-label", text);

  el.innerHTML = text
    .split("")
    .map((char) =>
      char === " "
        ? " "
        : `<span class="split-char" style="display:inline-block">${char}</span>`
    )
    .join("");

  return el.querySelectorAll(".split-char");
}

export function splitByWords(el) {
  const text = el.textContent;
  el.setAttribute("aria-label", text);

  el.innerHTML = text
    .split(/(\s+)/)
    .map((word) =>
      word.match(/^\s+$/)
        ? word
        : `<span class="split-word" style="display:inline-block">${word}</span>`
    )
    .join("");

  return el.querySelectorAll(".split-word");
}

export function revertSplit(el) {
  const original = el.getAttribute("aria-label");
  if (original) {
    el.textContent = original;
    el.removeAttribute("aria-label");
  }
}
