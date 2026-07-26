# Transition App — Implementation Plan

## Phase 1: Foundation + Docs ✅

**Goal**: Project setup, documentation, and core data layer.

### Tasks
1. ✅ Write all documentation files (`docs/PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, `TRANSITIONS.md`, `IMPLEMENTATION-PLAN.md`, `CONTRIBUTING.md`)
2. ✅ Initialize shadcn/ui in the project (base-nova style)
3. ✅ Install shadcn components: `tabs`, `button`, `slider`, `select`, `card`, `badge`, `tooltip`, `separator`
4. ✅ Install `shiki` for syntax highlighting
5. ✅ Update `styles.css` with shadcn token mappings and dark mode variant
6. ✅ Update `ThemeToggle.tsx` to use View Transitions API for theme switching
7. ✅ Create `data/transitions.ts` with all 8 transition definitions
8. ✅ Create `lib/easings.ts` with easing reference data

### Verification
- [x] `npx shadcn@latest init` completes without errors
- [x] shadcn components render correctly
- [x] Theme toggle works with view transition animation
- [x] `data/transitions.ts` exports all 8 templates with valid TypeScript types

---

## Phase 2: Shared Components ✅

**Goal**: Build all reusable UI components.

### Tasks
1. ✅ Build `CopyButton.tsx` — shadcn Button + clipboard API + icon swap
2. ✅ Build `CodeBlock.tsx` — Shiki-highlighted code with CopyButton
3. ✅ Build `FrameworkTabs.tsx` — shadcn Tabs wrapping 6 CodeBlocks
4. ✅ Build `TransitionPreview.tsx` — live theme-toggle demo with dynamic CSS injection
5. ✅ Build `Playground.tsx` — shadcn Slider + Select for duration/easing/direction
6. ✅ Build `CategoryFilter.tsx` — filter pills using shadcn Button
7. ✅ Build `TransitionCard.tsx` — grid card with gradient preview + "Try it" button

### Verification
- [x] Each component renders in isolation
- [x] CopyButton copies code to clipboard
- [x] CodeBlock highlights syntax correctly
- [x] Playground controls update preview state
- [x] TransitionCard renders with correct props

---

## Phase 3: Pages ✅

**Goal**: Assemble homepage and detail page with all components.

### Tasks
1. ✅ Update `Header.tsx` — navigation items (Home link, Sparkles icon)
2. ✅ Build homepage (`routes/index.tsx`) — hero section + CategoryFilter + TransitionCard grid
3. ✅ Build detail page (`routes/transition/$slug.tsx`) — preview + playground + code tabs
4. ✅ Add route-level view transition CSS to `styles.css`
5. ✅ Handle missing/invalid slugs with not-found state
6. ✅ Build `lib/trigger-transition.ts` — shared live demo utility

### Verification
- [x] Homepage loads with all 8 transition cards
- [x] Category filter correctly shows/hides cards
- [x] Clicking a card navigates to `/transition/{slug}`
- [x] Detail page renders preview, playground, and code tabs
- [x] All 6 framework tabs show correct code
- [x] Invalid slug shows a helpful not-found message

---

## Phase 4: Polish ✅

**Goal**: Design system migration, homepage hero, templates page, and final cleanup.

### Tasks
1. ✅ Migrate to Geist design system (Vercel) — colors, typography, spacing, shadows
2. ✅ Install Geist Sans + Geist Mono fonts
3. ✅ Rewrite `styles.css` with Geist tokens
4. ✅ Update all components to Geist aesthetic
5. ✅ Add mask-based transitions (circle-reveal, circle-blur, circle-blur-top-left, polygon-reveal)
6. ✅ Create `/templates` route with search and category filter
7. ✅ Rework homepage with hero theme toggle demo + featured templates
8. ✅ Update Header with Templates nav link
9. ✅ Update docs (PRD, ARCHITECTURE, TRANSITIONS, IMPLEMENTATION-PLAN)
10. Responsive testing: 375px, 768px, 1024px, 1440px
11. Dark mode verification for all pages and components
12. Keyboard accessibility: tab order, focus management, enter/space on buttons
13. Run `pnpm check` and `pnpm lint` — fix all issues
5. Responsive testing: 375px, 768px, 1024px, 1440px
6. Dark mode verification for all pages and components
7. Add view transitions for route navigations (app uses its own transitions)
8. Keyboard accessibility: tab order, focus management, enter/space on buttons
9. Run `pnpm check` and `pnpm lint` — fix all issues
10. Update any docs that deviated from implementation

### Verification
- [ ] All pages look correct at 375px, 768px, 1024px, 1440px
- [ ] Dark mode consistent — no light flashes, correct token usage
- [ ] `pnpm check` passes with 0 errors
- [ ] `pnpm lint` passes with 0 errors
- [ ] `pnpm build` succeeds
- [ ] Docs match implementation

---

## Definitions of Done

A task is done when:
1. Code is written and passes TypeScript type checking
2. Biome lint/format passes
3. Component renders correctly in light and dark modes
4. Component is responsive at all breakpoints
5. No console errors or warnings
6. Docs updated if behavior differs from plan
