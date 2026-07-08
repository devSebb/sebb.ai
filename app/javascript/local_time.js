// Footer local-time widget. Renders into [data-local-time]; an optional
// data-timezone (IANA name) pins the clock to a specific place, otherwise
// the visitor's own timezone is used.

import { registerInteraction } from "utils/lifecycle";

function init() {
  const els = document.querySelectorAll("[data-local-time]");
  if (!els.length) return null;

  const update = () => {
    els.forEach((el) => {
      try {
        el.textContent = new Intl.DateTimeFormat(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: el.dataset.timezone || undefined
        }).format(new Date());
      } catch {
        el.textContent = "";
      }
    });
  };

  update();
  const interval = setInterval(update, 30_000);
  return () => clearInterval(interval);
}

registerInteraction(init);

export { init };
