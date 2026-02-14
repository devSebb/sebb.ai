# Sebb.ai — Full Application Audit

**Date:** February 13, 2025  
**Scope:** Architecture, design, content, sections, theme, and visual expression  
**Mode:** Audit only — no code changes

---

## 1. Executive Summary

**sebb.ai** is a personal portfolio site for **Sebastian Burke** (nickname: Sebb), presenting him as a Software Developer & Designer. The site is built with **Ruby on Rails 7.2**, uses **server-rendered ERB views**, **Tailwind CSS**, **Stimulus**, **Turbo**, and **GSAP/Lenis** for animations and smooth scrolling. Content is centralized in `config/content/portfolio.yml` and loaded via `Portfolio::Content`. The design is a dark, tech-forward theme with neon green accents on a neutral-900 background.

---

## 2. Architecture Overview

### 2.1 Stack & Entry Points

| Layer | Technology |
|-------|------------|
| Framework | Rails 7.2 |
| Views | ERB partials (no React/Vue) |
| Styling | Tailwind CSS |
| JS | Importmap, Stimulus, GSAP, Lenis |
| Content | YAML (`config/content/portfolio.yml`) + `Portfolio::Content` |
| DB | PostgreSQL (contacts only) |

**Entry points:**
- **Rack:** `config.ru` → `Rails.application`
- **Layout:** `app/views/layouts/application.html.erb`
- **JS:** `app/javascript/application.js` (imports Turbo, Stimulus, animations, smooth scroll)

### 2.2 Request Flow

```
/                    → PagesController#home    → home.html.erb (+ sidebar + shared partials)
/resume              → PagesController#resume  → resume.html.erb
/projects/:name      → PagesController#project → project.html.erb
POST /contact        → ContactsController#create → redirect
/design              → 302 redirect to Framer portfolio
```

### 2.3 Content Architecture

- **Single source of truth:** `config/content/portfolio.yml`
- **Loader:** `app/lib/portfolio/content.rb` (YAML load + schema validation)
- **Exposed as:** `@identity`, `@about`, `@links`, `@tech_stack`, `@tech_icons`, `@experience`, `@specializations`, `@projects`, `@contact_meta`, `@resume`

---

## 3. Design & Theme

### 3.1 Visual Identity

| Token | Value | Usage |
|-------|-------|-------|
| **Primary** | `#0ED762` | Headings, CTAs, accents, box shadows |
| **Secondary** | `#00FF85` | Hover states, alternate highlights |
| **Text** | `#fff` | Body text, headings |
| **Background** | `neutral-900` | Main page background |

### 3.2 Typography

- **Sans / body:** Raleway (variable weight 100–900)
- **Headings:** Russo One (display)
- **Source:** Google Fonts (`Raleway` + `Russo One`)

### 3.3 Background & Atmosphere

- **Body:** `bg-neutral-900`, white text, `min-h-screen`
- **Ambient effect:** `body::before` — fuchsia-400 at 20% opacity, 100px blur
- **Cards:** `border-2 border-gray-300`, `backdrop-blur-lg`, `rounded-md`
- **Interactive cards:** `box-shadow: 0 0 9px 3px #0ED762` (green glow)
- **Hover:** `hover:scale-105`, `hover:shadow-2xl`, transitions ~300ms

### 3.4 Component Patterns

- **Section card:** `section-card` = bordered, rounded, backdrop blur
- **Interactive card:** `interactive-card` = hover scale 1.05, border-primary, shadow-lg
- **Icon link:** `icon-link` = 8×8, hover scale 1.10
- **Form focus:** `focus:ring-primary`, `focus:border-primary`

### 3.5 Responsive Strategy

- Tailwind breakpoints: `md:`, `lg:` used across layout
- Timeline: media query at 768px switches to single-column layout
- Main content: `px-3`, `md:mx-14`, `lg:mx-16`

---

## 4. Page Layout & Sections (Home)

The homepage uses a **flex layout** with a **sticky left sidebar** and scrollable main content.

### 4.1 Structural Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Sidebar 256px]  │  [Main Content - scrollable]                     │
│  - Profile        │  - Hero (intro + about)                           │
│  - Social links   │  - Tech Stack carousel                            │
│  - CTA buttons    │  - Experience timeline                            │
│  [Collapse btn]   │  - Specializations grid                           │
│                   │  - Projects grid                                  │
│                   │  - Contact form                                   │
└─────────────────────────────────────────────────────────────────────┘
```

**Vertical spacing:** `space-y-44` (11rem) between major sections.

### 4.2 Sidebar (Left, Sticky)

**File:** `_sidebar.html.erb`  
**Controller:** `left_sidebar_controller.js` (Stimulus)

**Content:**
- **Nickname:** SEBB (uppercase, bold, 2xl)
- **Role:** “Software Developer & Designer” (gray-300)
- **Profile image:** `profile_pic.png` (rounded-full, 44×44)
- **Social:** GitHub, LinkedIn, X (icons with hover scale)
- **CTAs:** Contact (anchor `#contact`), Resume (link)

**Visual:** Rounded `section-card`, shadow-xl, flex column, spacer pushes CTAs to bottom.

**Behavior:** Collapsible via Stimulus; gray rounded toggle at right edge; transitions 300ms.

### 4.3 Hero + About

**File:** `_hero.html.erb`  
**Data:** `@about`, `@identity`, `@links`

**Structure:**

1. **Top-right link**
   - “[design portfolio]” → external Framer site

2. **Main heading**
   - “Hello and welcome, people call me”
   - **Sebb** in primary green, font-heading (Russo One), 6xl
   - Animated SVG icon (ithinkicode.svg) top-right, `animate-spin-slow`

3. **Rotating role line**
   - “I’m a …..” with GSAP TextPlugin cycling:
     - software developer, web designer, mobile app designer, product manager, business developer, digital designer, project manager, product designer, advertising designer

4. **Short description**
   - “I design and build digital products. I turn ideas for software and advertising products into reality, a beautiful reality.”

5. **About card**
   - Title: “About”
   - Three long paragraphs (from YAML)
   - Card: `border-2 border-gray-300`, `bg-background-primary`, `backdrop-blur-lg`, `shadow-xl`, `hover:shadow-2xl`

**Visual:** Sticky top block, high spacer (60vh), icon fixed and scroll-synced (path animation).

### 4.4 Tech Stack Carousel

**File:** `_techstach_carousel.html.erb`  
**Data:** `@tech_stack`, `@tech_icons`

**Title:** “My Tech Stack”

**Layout:**
- Two horizontal carousels
- First half: `animate-scroll-left` (20s)
- Second half: `animate-scroll-right` (20s)
- Each item: 32×32 icon, tech name on hover (black/75 overlay)
- Duplicated rows for infinite loop
- `hover:pause-animation` on container

**Tech items (examples):** Ruby, Rails, Tailwind, HTML, CSS, GitHub, GSAP, PostgreSQL, Figma, MySQL, Git, Bootstrap, Sass, Firebase, JavaScript, APIs, Slack, Notion, Jira, MongoDB, Framer.

### 4.5 Experience Timeline

**File:** `_experience.html.erb`  
**Data:** `@experience`

**Title:** “Experience”

**Structure:** Vertical border-s timeline
- Gray left border (`border-s border-gray-200`)
- Each item: dot (`.experience-dot`), date, title, summary
- GSAP: dots animate to primary green + scale 1.5 on scroll into view

**Entries (from YAML):**
1. Product & Digital Designer at White Tiger (Aug 2024)
2. Full Stack Developer (Jul 2024)
3. Co-Founder & Operations Lead (Jan 2023)
4. Project Manager at Galería Shopping (May 2020)

### 4.6 Specializations

**File:** `_specializations.html.erb`  
**Data:** `@specializations`

**Title:** “What I Specialize in”

**Layout:** 2-column grid
- Six cards with icon, title, description
- GSAP: staggered fade-in on scroll (top 80%); hover lift + shadow

**Cards:**
1. Full-Stack Web Development  
2. Mobile App Development  
3. UI/UX Design  
4. Performance Optimization  
5. AI Integration  
6. Scalability  

**Visual:** `section-card`, `interactive-card`, `box-shadow` (green glow).

### 4.7 Projects Grid

**File:** `_projects.html.erb`  
**Data:** `@projects`

**Title:** “Projects”

**Layout:** 2-column grid
- Each card: image (`projects/#{image}`), hover overlay
- Overlay: project name, description, “See More” (to project detail), external link
- GSAP: staggered intro on scroll; hover lift, image scale 1.05

**Projects:**
1. More XP — job-market experiences platform  
2. Make-Me-Fit — AI meal planning  
3. Domo Kanban Board — Rails Kanban  
4. Arabella Rock & Roll Store — e-commerce  

### 4.8 Contact

**File:** `_contact.html.erb`  
**Data:** `@contact_meta`

**Structure:** 50/50 split
- Left: Heading “Let’s Work Together” (split by spaces with `<br>`), 6xl, primary, font-heading
- Right: Form (name, email, message), dark inputs, primary focus ring

**Form:** `POST /contact` → ContactsController#create → redirect with flash.

---

## 5. Resume Page (`/resume`)

**File:** `resume.html.erb`  
**Data:** `@identity`, `@resume`

**Layout:** Single column, centered, `px-32 py-8` (no sidebar).

**Sections:**
1. **Header** — Back arrow (root), “Sebastian Burke” (4xl bold)
2. **Experience** — Title, date, bullets per role (from `@resume[:experience]`)
3. **Education** — Le Wagon bootcamp, Tulane BS Management
4. **Certifications** — Grid (Udemy courses: Tailwind, JS, Flutter, Dart)
5. **Skills** — Technical (Rails, React, etc.) + Additional (management, analytics, etc.)
6. **Footer** — “© 2024 Sebastian Burke. All rights reserved.”

**Visual:** Same dark theme, `border-b border-gray-700` for section titles, gray-800 cards for skills/certs.

---

## 6. Project Detail Page (`/projects/:name`)

**File:** `project.html.erb`  
**Data:** `@project`, `@projects`, `@tech_icons`

**Layout:**
- **Back button:** Fixed top-left, primary SVG arrow → root
- **Title:** Project name (6xl, font-heading, primary)
- **Hero image:** `projects/#{@project[:image]}`, rounded, hover scale
- **Project tabs:** Pills for each project (active state with shadow-primary)
- **Sidebar card:** Detailed description, “Built with” tech icons, features list, “Visit Project” CTA

**Visual:** Backdrop blur cards, black/20 backgrounds, primary accents on CTAs.

---

## 7. GSAP & Animation Map

| Module | Target | Behavior |
|--------|--------|----------|
| `hero_animations` | `#hero-text`, icon | TextPlugin role rotation; icon fixed + scroll timeline (opacity fade) |
| `experience_animations` | `.experience-dot` | ScrollTrigger: green + scale 1.5 on enter |
| `specializations_animations` | Title, boxes | Stagger fade-in at top 80%; hover lift + shadow |
| `projects_animations` | Title, cards | Stagger fade-in; hover lift, image scale, overlay opacity |
| `resume_animations` | `.timeline-item`, `.group` | Registered but selectors may not match current resume markup |
| `smooth_scroll` | Global | Lenis + ScrollTrigger integration; anchor click smooth scroll |

**Trigger registration:** `data-animate="hero|experience|specializations|projects|resume"` on section containers.

**Cleanup:** `turbo:before-cache` — `destroyAll()`, `ScrollTrigger.getAll().forEach(kill)`, Lenis destroy.

---

## 8. Assets & Content Inventory

### 8.1 Images Present (app/assets/images)

- `ithinkicode.svg` — Hero icon  
- `icons/` — GitHub, LinkedIn, X, back_arrow, Stack, Mobile, Frontend, Performance, AI, Scalability  
- `menu/` — home.svg, techstack.svg  

### 8.2 Referenced but Possibly Missing

- `profile_pic.png` — Sidebar  
- `projects/*` — more_XP_index.png, MMF_Home.png, Domo_Kanban.png, Arabella_index.png  
- `techstack/*` — API, Ruby, Rails, Tailwind, PostgreSQL, GSAP, etc.  

**Note:** `link_tree ../images` would serve only files under `app/assets/images`. Project and techstack paths would need assets in `app/assets/images/projects/` and `app/assets/images/techstack/`.

### 8.3 Favicon / PWA

- Favicon: `ithinkicode.svg`  
- Layout also references `/icon.png` (PNG variant)  
- PWA: `manifest.json`, `service-worker.js` via PwaController  

---

## 9. Section Summary Table

| Section | Title | File | Main content |
|---------|-------|------|--------------|
| Sidebar | — | `_sidebar.html.erb` | SEBB, role, profile pic, social links, Contact/Resume |
| Hero | — | `_hero.html.erb` | “People call me Sebb”, rotating roles, short bio |
| About | About | `_hero.html.erb` | Three paragraphs from YAML |
| Tech Stack | My Tech Stack | `_techstach_carousel.html.erb` | Dual carousels, 20 techs |
| Experience | Experience | `_experience.html.erb` | Four roles, timeline |
| Specializations | What I Specialize in | `_specializations.html.erb` | Six service cards |
| Projects | Projects | `_projects.html.erb` | Four project cards |
| Contact | Let’s Work Together | `_contact.html.erb` | Name, email, message form |
| Resume | — | `resume.html.erb` | Experience, Education, Certs, Skills |
| Project Detail | [Project name] | `project.html.erb` | Hero, tabs, description, tech, features, CTA |

---

## 10. Design Visualization (Text Description)

**Overall look:** Dark portfolio with a tech/developer focus. Background is neutral-900; a soft fuchsia blur adds depth. Primary green (`#0ED762`) dominates accents—headings, CTAs, hover states, and glow effects. Typography is modern: Raleway for body, Russo One for headings.

**Homepage flow:**
1. Left sidebar: dark card with profile, links, and CTAs; green-accent buttons.
2. Hero: large “Sebb” in green, rotating role text, spinning icon.
3. About: bordered card with long personal paragraphs.
4. Tech: horizontal carousels of tech icons, labels on hover.
5. Experience: vertical timeline with green-animated dots.
6. Specializations: 2×3 grid of cards with icons and green glow on hover.
7. Projects: 2×2 grid of image cards; hover reveals overlay with links.
8. Contact: split layout—large “Let’s Work Together” heading and dark form on the right.

**Resume:** Single-column document style, same dark palette and section separators.

**Project:** Large hero image, project tabs, sidebar card with description and tech stack.

**Interactions:** Smooth scroll (Lenis), staggered scroll-triggered reveals, hover lifts and scale on cards and icons. Sidebar collapses with a gray circular button.

---

## 11. Data Flow & Content Sources

| View variable | Source | File |
|---------------|--------|------|
| `@identity` | `Portfolio::Content.identity` | portfolio.yml `identity` |
| `@links` | `Portfolio::Content.links` | portfolio.yml `links` |
| `@about` | `Portfolio::Content.about` | portfolio.yml `about` |
| `@tech_icons` | `Portfolio::Content.tech_icons` | portfolio.yml `tech_icons` |
| `@tech_stack` | `Portfolio::Content.tech_stack` | portfolio.yml `tech_stack` |
| `@experience` | `Portfolio::Content.experience` | portfolio.yml `experience` |
| `@specializations` | `Portfolio::Content.specializations` | portfolio.yml `specializations` |
| `@projects` | `Portfolio::Content.projects` | portfolio.yml `projects` |
| `@contact_meta` | `Portfolio::Content.contact` | portfolio.yml `contact` |
| `@resume` | `Portfolio::Content.resume` | portfolio.yml `resume` |
| `@project` | `Portfolio::Content.project_by_slug(name)` | portfolio.yml `projects` |

---

## 12. Notable Gaps / Inconsistencies (Informational Only)

1. **Assets:** `profile_pic.png`, `projects/*`, `techstack/*` referenced but not found under `app/assets/images`.
2. **bg-background-primary:** Used in About card; no `background-primary` in Tailwind config (only `.background-primary` in CSS).
3. **Font Awesome:** `<i class="fas fa-external-link-alt">` used; no explicit Font Awesome asset load in layout.
4. **Resume animations:** Targets `.timeline-item`, `.group`; resume template uses different structure.
5. **Tools section:** Mentioned in some docs; not present in current `home.html.erb`.
6. **icon.png:** Layout references `/icon.png`; `public/icon.svg` exists per docs.

---

*End of audit*
