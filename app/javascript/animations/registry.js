const registry = new Map();
const activeContexts = new Map();

function register(type, adapter) {
  registry.set(type, adapter);
}

function initScope(scope = document) {
  const sections = scope.querySelectorAll("[data-animate]");
  sections.forEach((section) => {
    const type = section.dataset.animate;
    const adapter = registry.get(type);
    if (!adapter) return;

    const previous = activeContexts.get(section);
    if (previous && typeof previous.destroy === "function") {
      previous.destroy();
    }

    const context = adapter.init(section);
    activeContexts.set(section, context || { destroy() {} });
  });
}

function destroyAll() {
  activeContexts.forEach((context) => {
    if (context && typeof context.destroy === "function") {
      context.destroy();
    }
  });
  activeContexts.clear();
}

export { register, initScope, destroyAll };
