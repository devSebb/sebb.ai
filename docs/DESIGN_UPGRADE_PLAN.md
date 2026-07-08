# Design Upgrade Plan — sebb.ai

*UI/UX deep-dive, July 2026. Based on a full repo audit + research into award-winning portfolios (Awwwards SOTD winners, Osmo pattern vault, design-engineer scene) and modern animation techniques (GSAP 3.13+, View Transitions, canvas/CSS backgrounds).*

**Status (2026-07-07): Phases 1–4 implemented and verified.** Remaining ideas (optional): consolidating the per-module reduced-motion checks into one root `gsap.matchMedia()`, a Lighthouse perf pass, and ScrambleText hover on plaques (needs the ScrambleTextPlugin CDN script). Notes: labeled curtain transitions were chosen over View Transitions shared-element morphs (they conflict); the footer clock defaults to visitor-local time labeled "The real world" — set `identity.location_label`/`timezone` in `config/content/portfolio.yml` to pin it to a city.

## Design thesis

The site already has a real concept — **a dark museum/exhibition**: rooms, wall labels, corridors, a gallery strip. That's the asset. The problem is the concept is only ~30% committed: the individual effects (multilingual-style preloader fade, magnetic buttons, custom cursor, dim-list-with-floating-image) are the exact "GSAP award-site starter pack" that research shows now reads as a template ("Dennis-clone syndrome" — copydennis.com exists to shame it). Meanwhile the museum idea, which nobody else has, is invisible: the background layer is 4 tiny SVG shapes at ~0.1 opacity, the preloader is a generic "DS" fade, the page transition is a plain green wipe.

**Rule for every change below: does it make this feel more like walking through an exhibition of Sebb's work? If not, cut it.** One committed concept beats twenty borrowed effects (Bruno Simon's car, Miranda's newspaper, Lynn Fisher's annual stunt — that's the winning pole). Keep the section order, palette (#0A0A0A / #0ED762), and type (Syne / Instrument Sans / IBM Plex Mono) exactly as they are.

---

## 1. Atmosphere — the biggest gap

The `#0A0A0A` void has no light, no texture, no depth. This is the single highest-impact upgrade and it's nearly free.

### 1.1 Gallery lighting (site-wide, pure CSS, ~0 KB JS)
- One or two huge near-monochrome radial gradients ("aurora blobs") behind the content — deep charcoal with a *very* faint green cast (e.g. `radial-gradient(closest-side, rgba(14,215,98,0.05), transparent)` on `#111` drift), animated on `transform` only with 40–60s keyframes. Reads as gallery track-lighting on a dark wall.
- **Film grain overlay**: fixed full-viewport layer, inline SVG `feTurbulence` (baseFrequency ~0.65) at 4–6% opacity, `mix-blend-mode: soft-light`, `pointer-events: none`. Kills gradient banding, adds the "expensive" texture every dark SOTD site has. Optional `steps()` jitter for living grain — still ~free.

### 1.2 Cursor spotlight (desktop, on-theme signature)
- A large soft radial "spotlight" that follows the cursor (single fixed div, `quickTo` x/y, ~600–900px radial gradient at 3–5% white), subtly illuminating what you point at. *This is a museum-native effect nobody in the clone-pack has* — the visitor holds the flashlight in the exhibition. `(pointer: fine)` + reduced-motion gated.

### 1.3 Hero floor grid (hero only, ~3 KB hand-rolled canvas)
- Replace the 4 floating SVG shapes with a vanilla-canvas **dot grid** in the hero: white/green dots at 6–10% opacity, proximity-brighten + slight displacement toward the cursor. Precomputed positions, one rAF, DPR capped at 2, squared-distance culling; static (no rAF) on touch; lazy-init via IntersectionObserver. Reads as architectural floor plan / blueprint — technical, precise, on-brand for a developer.
- Delete `floating_geometry.js` + the inline SVG layer (it contributes nothing at current opacities).

**No three.js, no shadergradient, no particle libraries** — research is unanimous these are either dated (particles.js) or overweight (150 KB+) for a typography-driven site. Total new JS ≈ 4 KB.

---

## 2. Commit to the museum concept

### 2.1 Room plaques
- Each section gets a small animated **wall plaque**: `ROOM 01 — ENTRANCE`, `ROOM 02 — THE COLLECTION` (projects), `ROOM 03 — MATERIALS & TOOLS` (skills), `ROOM 04 — PROVENANCE` (experience), `ROOM 05 — GUESTBOOK` (contact). Mono meta-label + hairline border, revealed with a short clip wipe + ScrambleText settle. The vocabulary is already in code comments — surface it to visitors.
- Projects become **catalogue entries**: `CAT. Nº 001` instead of plain numbers.

### 2.2 Preloader → exhibition ticket
- Replace the generic "DS" fade with a plaque/ticket moment: `DEVSEBB` in Syne + a mono line `A WORKING EXHIBITION — EST. 2024` + a catalogue-number counter (`Nº 000 → 100`, eased with pauses), then the existing clip-wipe exit. Keep sessionStorage first-visit gating (repeat preloaders are penalized by juries and users alike).

### 2.3 Page transitions → room-to-room
- Keep the accent wipe, but print the **destination room label** on the curtain mid-wipe (`ROOM 02 — THE COLLECTION` in mono, brief ScrambleText). A plain colored wipe is anonymous; a labeled one is wayfinding.
- Add `<meta name="view-transition" content="same-origin">` (Turbo 8 native) and give project thumbnails/titles `view-transition-name` on click → free shared-element morph from list row to detail hero. Progressive enhancement; reduced-motion kill switch in CSS.

### 2.4 Footer → gallery hours
- Add the now-standard footer widget, museum-flavored: local time via `Intl.DateTimeFormat` (`MONTERREY, MX — 14:32`), plus a pulsing green dot with `OPEN FOR COMMISSIONS`. Small, honest, signals a real human.

---

## 3. Motion system — unify, then differentiate

### 3.1 One easing language
- Adopt **one custom ease** for all entrances (e.g. `CustomEase("hop", "0.9, 0, 0.1, 1")` or `expo.out`) and standardize durations to the existing-but-unused tokens (`motion-fast/normal/slow`). Consistency of motion = perceived quality; today JS hardcodes 0.3/0.6/0.8s + ad-hoc eases and ignores the Tailwind tokens entirely.
- Consolidate: delete redundant `gsap_setup.js` (duplicates the inline init), drop registered-but-unused TextPlugin, prune the unused half of `motion_library.js`. Add ScrambleTextPlugin + SplitText (all free since GSAP 3.13).

### 3.2 Text reveals: masked lines, not rotating chars
- Replace the `rotationX:-90 back.out` char reveal (the most cloned GSAP demo effect) with **masked line reveals**: SplitText `type:"lines", mask:"lines", autoSplit:true`, `yPercent:110 → 0`, stagger 0.07, the house ease. Reserve char-level animation for the hero name only.
- Hero name signature: Syne is variable-weight (400–800) — map **font weight to scroll velocity or hover proximity** on the giant name. Kinetic type is the 2026 trend and it's pure CSS `font-variation-settings`, no lib.
- Use the unused `hero_rotating_titles` content: a single rotating role line under the name (masked roll, not typed.js typing — that's on the dated list).

### 3.3 Scroll choreography diet
- **Cut pinned-scrub sections from 4 to 1.** Keep the hero pin. Convert About, Experience, Contact to fire-once masked reveals (`start: "top 80%"`, run <1s) with light scrubbed parallax accents. Fixes the "heavy, samey" scroll feel the audit found, removes the main jank risk (4 pins + Lenis), and aligns with the 2026 anti-scroll-hijack consensus.
- Add one **global `data-speed` parallax system** for images/accents (the Osmo "Global Parallax Setup" pattern) instead of per-section bespoke tweens.
- Skills marquee: make it react to scroll — direction flips with scroll direction, speed scales with `getVelocity()`. Turns a generic marquee into a live one.

---

## 4. Section-by-section upgrades

**Hero** — floor-grid canvas (§1.3), variable-weight name (§3.2), rotating role line, masked reveals. Keep the ghost parallax layer but raise it to ~0.12 opacity with a slight y-offset so it actually reads.

**About** — unpin. Grayscale portrait gets **grayscale→color + slight scale on hover** (cheap, strong on dark). Paragraph reveal as masked lines.

**Projects** — keep the list-with-floating-preview (it works) but de-clone it: catalogue numbers (`CAT. Nº 001`), a **contextual cursor label** ("VIEW WORK" pill following the cursor over rows — the one custom-cursor variant research endorses), directional row background fill on hover, floating preview gets a 1px accent frame + corner caption like a gallery placard.

**Skills** — surface the **`tech_icons` logo map already in portfolio.yml** (currently 100% unused): monochrome logos at 40% opacity that light up on hover inside each category. Fix the invisible `text-muted/40` counts. Velocity-reactive marquee (§3.3).

**Experience** — unpin; fix the no-op color tween on the numbers (`experience_animations.js:49-54` tweens `#0ED762 → #0ED762`). Rows get the same masked-line + border-draw treatment, hover state matching the projects rows so the two lists share one language.

**Contact** — unpin. Fix placeholder contrast (`text-muted/40` on near-black fails WCAG — raise to full `muted` or use floating labels). Add form micro-states: focus underline draw in accent, inline validation, submit → button morphs to spinner → success check before the flash. Footer gallery-hours widget (§2.4).

**Project detail** — the gallery strip is already the best-engineered piece; leave it. Bring the rest of the page up to it: masked reveals for description/features, parallax on gallery images, and replace the off-palette `bg-amber-400` status pill with an accent-tinted or theme-color pill.

**Resume** — most under-animated page: per-section staggered masked reveals, hover states on certification/skill cards (border-accent + slight lift), keep the print stylesheet untouched.

**Menu** — roll-text hover on the big links (duplicate label stacked in overflow-hidden, translate -100% with tiny char stagger) instead of plain underline; mono index numbers (`01 — HOME`) to match the room system.

---

## 5. Hover language — three patterns, everywhere

Today seven hover vocabularies coexist. Reduce to three and apply consistently:
1. **Inline/text links** → underline **draw-through** (enters left, exits right; pure CSS `background-size`).
2. **Nav/menu/big links** → **roll text** (stacked duplicate, translate up).
3. **Buttons/CTAs** → fill from pointer entry point (`clip-path: circle()` from `--x/--y`) + label flip; keep magnetic on at most 2–3 primary CTAs at strength ≤0.3.
Plus the accent: **ScrambleText settle** on mono meta-labels/plaques on hover — terminal-meets-catalogue, very on-brand for a dev, and cheap.

---

## 6. Accessibility, mobile, performance

- **Contrast**: fix all `text-muted/40` usages (form placeholders, skill counts). Audit the `mix-blend-mode: difference` nav over mixed content.
- **Cursor**: keep native cursor visible always; follower elements stay `aria-hidden` + `pointer-events:none`; consider retiring the particle trail (occludes text, flagged by a11y research) in favor of the contextual "VIEW" label only.
- **Mobile parity**: today nearly all delight is desktop-only, leaving mobile flat. Masked text reveals, grain, aurora, parallax images, and view transitions all work on touch — ship them there. Only cursor-dependent effects (spotlight, dot-grid interaction, magnetic, floating preview) stay `(pointer: fine)`.
- **Reduced motion**: migrate the per-file early-returns to one root `gsap.matchMedia()` with three branches (desktop / touch / reduced). Reduced ≠ none: keep opacity fades, drop pins/scrub/scramble/parallax, render canvas static.
- **Perf hygiene**: content authored visible + hidden via `gsap.from` (nothing stuck at opacity:0 without JS); revert SplitText after intro completes; just-in-time `will-change`; lazy-init canvas; drop unused CDN plugins; replace hardcoded `#111111` in CSS with the `surface-dark` token.

---

## 7. Phased roadmap

**Phase 1 — Foundation & fixes (low risk, one session)**
Token/ease unification, delete gsap_setup.js + unused plugins, contrast fixes, amber pill → theme, no-op tween fix, hardcoded-color cleanup, hover-language consolidation (CSS), footer time/availability widget.

**Phase 2 — Atmosphere (the transformation)**
Aurora + grain (CSS), cursor spotlight, hero dot-grid canvas, delete floating_geometry, unpin About/Experience/Contact → masked fire-once reveals, global data-speed parallax.

**Phase 3 — Museum signature**
Room plaques + catalogue numbers, exhibition-ticket preloader, labeled room-to-room transitions, view-transition shared-element morph list→detail, rotating hero role line, variable-weight hero name.

**Phase 4 — Section polish**
Projects de-clone (cursor label, row fill, framed preview), skills logos + velocity marquee, contact form micro-states, resume + menu upgrades, mobile parity pass, reduced-motion consolidation, perf audit (Lighthouse before/after).

**Budget**: GSAP core + ScrollTrigger + SplitText + ScrambleText ≈ 45 KB gzip (all free), ~5 KB hand-rolled (dot grid, spotlight, time widget). Everything else is CSS.
