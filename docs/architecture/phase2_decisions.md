# Phase 2 Decisions

Recorded before Phase 2 execution.

1. Contact architecture: `persisted`
   - Contact submissions are persisted in the database.
   - Validation and delivery logic run from a persisted `Contact` record.

2. Canonical PWA endpoints:
   - Manifest endpoint: `/manifest.json`
   - Service worker endpoint: `/service-worker.js`
   - Layout and routes should align to these canonical paths.
