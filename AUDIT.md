# Sebb.ai — Full Platform Audit

**Date:** February 13, 2026  
**Scope:** Architecture, design, content, sections, animations, components, sources of truth  
**Mode:** Audit only — no code changes

---

## 1. Executive Summary

**sebb.ai** is a personal portfolio site for **Sebastian Burke** (nickname: Sebb), presenting him as a Software Developer & Designer. The site is built with **Ruby on Rails 7.2**, uses **server-rendered ERB views**, **Tailwind CSS**, **GSAP/Lenis** for animations and smooth scrolling, and **Turbo** for SPA-like navigation. Content is centralized in `config/content/portfolio.yml` and loaded via `Portfolio::Content`. The design is a dark, tech-forward "exhibition" theme with neon green accents (`#0ED762`) on a black background (`#0A0A0A`). Each homepage section is modeled as an "exhibition room" with scroll-pinned, scrub-driven reveals.

---

## 2. Architecture Overview

### 2.1 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Rails 7.2 |
| Views | ERB partials (no React/Vue) |
| Styling | Tailwind CSS (tailwindcss-rails) |
| JS | Importmap, Stimulus (minimal), GSAP, Lenis |
| Content | YAML (`config/content/portfolio.yml`) + `Portfolio::Content` |
| DB | PostgreSQL (contacts table only) |

### 2.2 Routes & Request Flow

| Route | Controller | Action | View |
|-------|------------|--------|------|
| `GET /` | `PagesController` | `home` | `pages/home.html.erb` |
| `GET /resume` | `PagesController` | `resume` | `pages/resume.html.erb` |
| `GET /projects/:name` | `PagesController` | `project` | `pages/project.html.erb` |
| `POST /contact` | `ContactsController` | `create` | redirect to root |
| `GET /design` | — | redirect | Framer portfolio (302) |
| `GET /service-worker.js` | `PwaController` | `service_worker` | PWA support |
| `GET /manifest.json` | `PwaController` | `manifest` | PWA support |

### 2.3 Content Architecture — Sources of Truth

**Single source of truth:** `config/content/portfolio.yml`

**Loader:** `app/lib/portfolio/content.rb`
- Loads YAML once (cached in `@data`)
- Validates via `Portfolio::Schema` (required keys, project uniqueness)
- Deep-symbolizes keys for Ruby access

**Exposed to views (via controller instance variables):**

| Variable | Content key | Used in |
|----------|-------------|---------|
| `@identity` | `identity` | Layout, Hero, About, Contact, Resume |
| `@links` | `links` | Contact, Menu overlay |
| `@about` | `about` | Hero, About |
| `@tech_icons` | `tech_icons` | Project detail (tech badges) |
| `@tech_stack` | `tech_stack` | Skills marquee |
| `@experience` | `experience` | Experience section |
| `@skills_categories` | `skills_categories` | Skills section |
| `@projects` | `projects` | Projects section, Project detail |
| `@project` | `projects` (by slug) | Project detail page |
| `@adjacent` | `projects` (prev/next) | Project detail nav |
| `@contact_meta` | `contact` | Contact section |
| `@resume` | `resume` | Resume page |

---

## 3. Page Structure & Components

### 3.1 Homepage (`pages/home.html.erb`)

**Order of sections (top to bottom):**

1. **Hero** — `_hero.html.erb` — Full-viewport intro
2. **About** — `_about.html.erb` — Bio paragraphs + profile
3. **Projects** — `_projects.html.erb` — List with hover preview
4. **Skills** — `_skills.html.erb` — Categories + marquee
5. **Experience** — `_experience.html.erb` — Timeline + Full Resume CTA
6. **Contact** — `_contact.html.erb` — Form + footer

Between sections: `<div class="room-corridor"></div>` — spacing (h-24/h-32).

### 3.2 Layout (`layouts/application.html.erb`)

**Global elements (always present):**

- **Custom cursor** — `cursor-dot`, `cursor-ring`, `cursor-particle` (desktop only, mix-blend-mode: difference)
- **Preloader** — "DS" letters, sessionStorage to skip on return visits
- **Fixed nav** — Logo (devSebb) + Menu button, mix-blend-mode: difference
- **Menu overlay** — Full-screen menu, clip-path animation, links to Home, Projects, About, Resume, Contact, socials
- **Page transition overlay** — Green wipe on Turbo navigation
- **Floating geometry** — SVG shapes (circle, dots, line, arc) with scroll parallax and subtle cursor response
- **Main content** — `yield` for page body

**Typography:** Syne (display), Instrument Sans (body), IBM Plex Mono (meta/labels).

**Scripts loaded:** GSAP + ScrollTrigger, TextPlugin, Flip, Observer (CDN); Lenis (smooth scroll); application.js via importmap.

### 3.3 Project Detail Page (`pages/project.html.erb`)

**Structure:**
1. Hero — Full-viewport, project-themed background (`theme_bg`), hero image with overlay
2. Metadata bar — Role, Year, Stack, Type (tagline)
3. Description — `detailed_description`
4. Features — Numbered list
5. Gallery — 2-column grid (if 2+ images)
6. Prev/Next — Adjacent project links

**Per-project theming:** `theme_color` and `theme_bg` from YAML applied to hero and accents.

### 3.4 Resume Page (`pages/resume.html.erb`)

**Sections:** Header, Experience, Education, Certifications, Skills (Technical + Additional), Footer.

**Note:** "Download PDF" link is `href="#"` — not functional.

---

## 4. Animation System

### 4.1 Architecture

- **Registry:** `animations/registry.js` — Maps `data-animate` values to init functions
- **Trigger:** Sections use `data-animate="hero|about|projects|skills|experience|contact|project-detail|resume"`
- **On turbo:load:** `initScope(document)` runs all matching sections
- **On turbo:before-cache:** `destroyAll()` + `ScrollTrigger.getAll().forEach(kill)`

### 4.2 Animation Modules

| Module | Target | Behavior |
|--------|--------|----------|
| **hero_animations** | Hero section | Character split, entrance timeline (preloader-aware), pinned scrub: parallax title layers, fade content out as scroll |
| **about_animations** | About section | Pinned scrub: label → word-stagger heading → paragraphs → profile |
| **projects_animations** | Projects section | Stagger rows on scroll; border draw; hover: floating cursor-follow image, blur name |
| **skills_animations** | Skills section | Category clip-path + scale entrance; heading char stagger; item stagger; infinite marquee (left/right) |
| **experience_animations** | Experience section | Pinned scrub: label → rows → borders → number pulse → title mask |
| **contact_animations** | Contact section | Pinned scrub: heading chars → email → socials → form → footer |
| **project_detail_animations** | Project page | Hero scroll-through (img scale, overlay); title char stagger; metadata, description, features, gallery, nav reveals |
| **resume_animations** | Resume page | Title char stagger; `.resume-item` stagger on scroll |

### 4.3 Global Interaction Modules

| Module | Purpose |
|--------|---------|
| **preloader** | "DS" fade in → hold → letter-spread fade; clip-path wipe; sessionStorage to skip on return |
| **menu_animations** | Toggle overlay with clip-path; link stagger; Menu ↔ Close text |
| **page_transitions** | Turbo: exit = green overlay scaleX left→right; entrance = scaleX right→left |
| **custom_cursor** | Dot + ring follow mouse; particles trail; ring expands on magnetic hover; morphs on project rows |
| **magnetic** | `[data-magnetic]` elements pull toward cursor (GSAP quickTo) |
| **floating_geometry** | `.floating-geo` elements: scroll parallax + cursor-follow parallax |
| **smooth_scroll** | Lenis smooth scroll; anchor click → smooth scroll to target |

### 4.4 Utilities

- **utils/text_splitter.js** — `splitByChars`, `splitByWords` for GSAP character/word animations
- **utils/motion_library.js** — `fadeInUp`, `charStagger`, `wordStagger`, `prefersReducedMotion`, etc.

### 4.5 Reduced Motion

All animation modules check `prefersReducedMotion()` and return early. CSS `@media (prefers-reduced-motion: reduce)` disables animations/transitions globally.

---

## 5. Design & Theme

### 5.1 Colors (Tailwind)

| Token | Value | Usage |
|-------|-------|-------|
| `accent` | `#0ED762` | CTAs, underlines, highlights, focus |
| `accent-dim` | `rgba(14, 215, 98, 0.2)` | Subtle fills |
| `accent-glow` | `rgba(14, 215, 98, 0.4)` | Glows |
| `surface-black` | `#0A0A0A` | Main background |
| `surface-dark` | `#111111` | Cards, darker areas |
| `surface-mid` | `#1A1A1A` | — |
| `surface-light` | `#F5F5F0` | Body text |
| `muted` | `#6B6B6B` | Secondary text |
| `border` | `#2A2A2A` | Borders |

### 5.2 Typography

- **Display:** Syne (extrabold for headings)
- **Body:** Instrument Sans
- **Meta/Labels:** IBM Plex Mono (uppercase, tracking, small size)

Custom font sizes: `display-xl`, `display-lg`, `display-md`, `display-sm`, `body-lg`, `body`, `meta`, `meta-sm`.

### 5.3 Component Classes

- `.section-room` — Full-width section, min-h-screen, gutter padding
- `.meta-label` — Mono, uppercase, tracking, muted
- `.heading-display` — Display font, xl size
- `.accent-line` — Green underline block
- `.btn-magnetic` — Accent border button, hover fill
- `.room-corridor` — Spacer between sections
- `.hover-underline` — Underline on hover via ::after

---

## 6. Projects — How They Work

### 6.1 Data Structure (YAML)

Each project in `portfolio.yml` under `projects:`:

```yaml
- slug: "billdeck"           # URL path: /projects/billdeck
  name: "Billdeck"
  tagline: "Freelancer invoicing & proposals"
  description: "..."         # Short
  detailed_description: "..." # Long
  hero_image: "projects/Billdeck/Billdeck_1.png"
  gallery: ["...", "..."]     # Optional
  theme_color: "#0ED762"
  theme_bg: "#0A0A0A"
  year: "2026"
  role: "Full Stack Developer & Designer"
  features: ["...", "..."]
  technologies: ["ruby", "postgres", "tailwind", "gsap"]
```

### 6.2 Project Flow

1. **Homepage:** Projects list links to `project_path(project[:slug])` → `/projects/:slug`
2. **Projects section:** Row layout (number, name, tagline, year); hover shows floating image (`hero_image`) that follows cursor
3. **Project detail:** `Portfolio::Content.project_by_slug(params[:name])` loads project; `adjacent_projects` for prev/next
4. **404:** If `@project` nil → redirect to root with alert

### 6.3 Current Projects (from YAML)

1. **Billdeck** — Freelancer invoicing & proposals (2026)  
2. **Papayal** — Ecuador remittances gift cards (2025)  
3. **Tripstein** — Real-cost travel budgeting (2026)  
4. **TwitchMetrics** — Creator analytics (2025)

---

## 7. Assets & Images

### 7.1 Referenced Paths

| Path | Used in | Present? |
|-----|---------|-----------|
| `profile.JPG` | About section | **Not found** (no profile.* in app/assets/images) |
| `projects/Billdeck/Billdeck_1.png` | Billdeck hero/gallery | **Not found** |
| `projects/Papayal/Mockup_Desktop_1.png` | Papayal | **Not found** |
| `projects/Tripstein/Tripstein_1.png` | Tripstein | **Not found** |
| `projects/TwitchMetrics/Twitchmetrics_1.png` | TwitchMetrics | **Not found** |
| `techstack/*` (api_icon, ruby_logo, etc.) | tech_icons (project detail) | **Not found** |
| `ithinkicode.svg` | Favicon | ✓ (app/assets/images) |

### 7.2 Present in `app/assets/images`

- `ithinkicode.svg`
- `icons/` — back_arrow, github, linkedin, x, Stack, Mobile, Frontend, Performance, AI, Scalability
- `menu/` — home.svg, techstack.svg

**Note:** `link_tree ../images` serves only `app/assets/images`. Project and techstack images must live under `app/assets/images/` to be found.

---

## 8. Contact Flow

### 8.1 Current Behavior

1. Form posts to `POST /contact`
2. `ContactsController#create` builds `Contact.new(contact_params)`
3. On save: redirect to root with `flash[:success]`
4. On error: redirect to `#contact` with `flash[:error]`

### 8.2 Gaps

- **Flash display:** Layout does not render `flash[:success]` or `flash[:error]` — user gets no feedback
- **Email:** `ContactMailer#contact_email` exists but is never called — messages are only stored in DB, not emailed

---

## 9. Notable Inconsistencies & Gaps

1. **Assets:** `profile.JPG`, `projects/*`, `techstack/*` referenced but not present under `app/assets/images`
2. **Resume "Download PDF":** Link is `href="#"` — no PDF generation or static PDF link
3. **Flash messages:** No UI to show success/error after contact form
4. **Contact email:** Mailer defined but not invoked
5. **AUDIT.md (previous):** Referenced `@specializations` and `_specializations.html.erb` — current code uses `@skills_categories` and `_skills.html.erb`
6. **identity.footer_copyright_year:** YAML has `"2025"`; may want `"2026"` for current year

---

## 10. File Map

### Views

```
app/views/
├── layouts/
│   └── application.html.erb    # Layout, nav, menu, cursor, preloader, geometry
├── pages/
│   ├── home.html.erb           # Renders 6 shared partials + corridors
│   ├── resume.html.erb
│   └── project.html.erb
├── shared/
│   ├── _hero.html.erb
│   ├── _about.html.erb
│   ├── _projects.html.erb
│   ├── _skills.html.erb
│   ├── _experience.html.erb
│   └── _contact.html.erb
└── pwa/
    └── manifest.json.erb
```

### JavaScript

```
app/javascript/
├── application.js              # Entry: Turbo, Stimulus, animation registry, all modules
├── animations/
│   └── registry.js             # data-animate → init mapping
├── utils/
│   ├── text_splitter.js
│   └── motion_library.js
├── hero_animations.js
├── about_animations.js
├── projects_animations.js
├── skills_animations.js
├── experience_animations.js
├── contact_animations.js
├── project_detail_animations.js
├── resume_animations.js
├── smooth_scroll.js
├── gsap_setup.js
├── preloader.js
├── menu_animations.js
├── page_transitions.js
├── custom_cursor.js
├── magnetic.js
└── floating_geometry.js
```

### Content & Config

```
config/
├── content/
│   └── portfolio.yml           # SOURCE OF TRUTH
├── routes.rb
├── tailwind.config.js
└── importmap.rb
```

### Lib

```
app/lib/portfolio/
├── content.rb                  # YAML loader + accessors
└── schema.rb                   # YAML validation
```

---

## 11. Summary

The platform is a well-structured Rails portfolio with a clear content pipeline (`portfolio.yml` → `Portfolio::Content` → controller → views). The design is a dark "exhibition" theme with GSAP-driven scroll animations, custom cursor, magnetic buttons, and Lenis smooth scroll. Projects are listed and linked by slug; the project detail page uses per-project theming. Main gaps: missing project/profile/techstack images, nonfunctional Download PDF, no flash display, and ContactMailer not wired. The animation system is modular and respects reduced motion preferences.

---

*End of audit*
