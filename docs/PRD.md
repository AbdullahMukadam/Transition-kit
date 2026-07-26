# Transition App — Product Requirements Document

## Overview

Transition App is a web-based showcase and playground for CSS View Transitions API page transitions. It provides developers with premade, copy-ready transition templates, live previews, customizable playgrounds, and framework-specific code snippets (Vanilla JS, React, Next.js, Vue, Svelte).

## Target Users

Frontend developers who want to add polished page transitions to their projects but don't want to write the CSS/JS from scratch.

## Goals

1. Showcase 9+ page transition templates using the View Transitions API
2. Feature mask-based theme transitions prominently on the homepage
3. Provide live, interactive previews for each transition
4. Let users customize transition parameters (duration, easing, direction) in a playground
5. Supply copy-ready code snippets for multiple frameworks
6. Serve as a reference guide for implementing View Transitions in any project

## Functional Requirements

### F1 — Homepage
- Hero section with app title, subtitle, and live theme toggle demo (circle blur transition)
- "Try a theme toggle" button that triggers a real `document.startViewTransition()` theme switch
- Feature cards explaining the app (View Transitions API, Copy & Paste, Framework Agnostic, Customizable)
- Featured templates section showing mask-based transitions
- "View all" link to `/templates`
- Browser support note

### F2 — Templates Page (`/templates`)
- Full grid of all transition templates
- Search input with icon for filtering by name/description/category
- Category filter bar (All / Simple / Mask / 3D / Composite)
- Responsive grid (1→2→3 columns)
- Empty state when no results match
- Each card shows: name, description, category badge, gradient preview with "Try it" button, link to detail page

### F3 — Transition Detail Page (`/transition/$slug`)
- Dynamic route loading transition data from the catalog
- Header with transition name, description, and browser support badge
- Live preview with "Try it live" button (theme toggle demo)
- Playground panel with controls (duration, easing, direction)
- Tabbed code section (CSS / JS / React / Next.js / Vue / Svelte)
- Each code tab has a copy-to-clipboard button
- Step-by-step implementation guide

### F4 — Live Preview
- "Try it live" button injects the transition CSS and triggers a real `document.startViewTransition()` theme toggle (light↔dark)
- The entire app becomes the preview — users see the transition applied to the real UI
- Transition CSS is dynamically injected with duration/easing from the playground
- Available on both homepage cards, templates page cards, and detail page

### F5 — Playground Controls
- Duration slider: 100ms–3000ms (default per template)
- Easing picker: ease-in, ease-out, ease-in-out, custom cubic-bezier
- Direction picker: left/right/up/down (for slide transitions only)
- All controls update the live preview instantly

### F6 — Code Snippets
- 6 tabs per transition: CSS, JavaScript, React, Next.js, Vue, Svelte
- Syntax highlighting via Shiki
- Copy button on each tab with success feedback (icon swap)
- Code includes comments explaining key parts

### F7 — Theme Toggle
- Light / Dark / Auto mode switching
- Uses View Transitions API for theme switch animation
- Persists preference to localStorage

### F8 — Browser Support
- Badge indicating View Transitions API support status
- Graceful fallback message when API is unavailable
- "Play" button disabled with tooltip when unsupported

### F9 — Responsive Design
- Mobile-first layout
- Single column on mobile, two on tablet, three on desktop
- Playground controls stack vertically on mobile
- Code blocks scroll horizontally on mobile

## Acceptance Criteria

- [ ] All 9 transition templates render correctly in live preview
- [ ] Homepage hero triggers a real theme toggle with circle blur transition
- [ ] Templates page has working search and category filter
- [ ] Copy button works across all code tabs
- [ ] Playground controls update preview in real-time
- [ ] Theme toggle works with view transition animation
- [ ] All pages responsive from 375px to 1440px+
- [ ] Dark mode consistent across all components
- [ ] `pnpm check` and `pnpm lint` pass with no errors
- [ ] Page transitions work in Chrome 111+, Edge 111+
- [ ] Graceful fallback message in unsupported browsers
