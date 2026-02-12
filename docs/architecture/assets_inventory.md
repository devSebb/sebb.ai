# Asset Inventory

## Canonical content asset sources

- Section and page image references are defined in `config/content/portfolio.yml`.
- Shared icon assets live under `app/assets/images/icons`.
- Brand SVG lives at `app/assets/images/ithinkicode.svg`.

## Known runtime icon strategy

- Social and specialization icons use local SVG assets.
- Project external-link indicators currently rely on Font Awesome CSS classes (`fas fa-external-link-alt`).
- If Font Awesome is not loaded globally, those inline `<i>` icons degrade gracefully without blocking page rendering.

## PWA assets

- Manifest endpoint: `/manifest.json`
- Service worker endpoint: `/service-worker.js`
