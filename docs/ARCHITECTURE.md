# Transition App — Architecture

## Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | TanStack Start (React) | latest |
| Routing | TanStack Router (file-based) | latest |
| Styling | Tailwind CSS v4 | ^4.1.18 |
| UI Components | shadcn/ui (base-nova style) | latest |
| Syntax Highlighting | Shiki | latest |
| Icons | lucide-react | ^0.545.0 |
| Language | TypeScript (strict) | ^6.0.2 |
| Bundler | Vite 8 | ^8.0.0 |
| Linter/Formatter | Biome | 2.4.5 |
| Runtime | Cloudflare Workers | via @cloudflare/vite-plugin |
| Package Manager | pnpm | latest |
| Design System | Geist (Vercel) | — |

## Routing

TanStack Router file-based routing:

```
src/routes/
├── __root.tsx              # Root shell (HTML, head, body, header, footer)
├── index.tsx               # Homepage — hero + featured templates
├── templates/
│   └── index.tsx           # Templates page — search, filter, full grid
└── transition/
    └── $slug.tsx           # Dynamic detail page (/transition/:slug)
```

- `__root.tsx` wraps all pages with Header, Footer, Scripts, and devtools
- `index.tsx` is the homepage with hero theme toggle demo + featured mask transitions
- `templates/index.tsx` is the full templates page with search and category filter
- `transition/$slug.tsx` loads transition data from `data/transitions.ts` by slug param

## Component Tree

```
<html>
├── <HeadContent />             # Meta, links, fonts
├── <body>
│   ├── <Header />              # Sticky nav with ThemeToggle
│   │   └── <ThemeToggle />     # Light/Dark/Auto with view-transition
│   ├── {children}              # Route content
│   │   ├── Homepage
│   │   │   ├── Hero section (live theme toggle demo)
│   │   │   ├── Feature cards
│   │   │   └── Featured templates grid
│   │   ├── Templates page
│   │   │   ├── Search input
│   │   │   ├── <CategoryFilter />
│   │   │   └── Grid of <TransitionCard />
│   │   └── Detail page
│   │       ├── Header section
│   │       ├── <TransitionPreview />  (live theme-toggle demo)
│   │       ├── <Playground />
│   │       └── <FrameworkTabs />
│   │           └── <CodeBlock /> × 6
│   │               └── <CopyButton />
│   ├── <Footer />
│   └── <Scripts />
```

## Data Flow

```
data/transitions.ts
    │
    ├──► Homepage: featured templates → hero demo + TransitionCard grid
    │       └── "Try a theme toggle" button → triggerLiveTransition()
    │
    ├──► Templates page: search + filter → full TransitionCard grid
    │
    └──► Detail page: match $slug → load full template
            │
            ├──► TransitionPreview: "Try it live" button → triggerLiveTransition()
            ├──► Playground: state (duration, easing, direction) → update CSS injection
            └──► FrameworkTabs: render code strings from template.frameworks
```

## Theming

### Token System

Two-layer CSS custom properties:

1. **Raw tokens**: `--gray-1000`, `--blue-700`, `--surface`, etc. (defined in `:root` and `[data-theme="dark"]`)
2. **Semantic tokens**: `--background`, `--foreground`, `--primary`, `--card`, etc. (mapped to raw tokens)

shadcn components use semantic tokens; custom components can use either.

### Dark Mode

- `data-theme="dark"` attribute on `<html>` (set by ThemeToggle)
- `@custom-variant dark (&:is([data-theme="dark"] *));` in CSS
- System preference fallback via `prefers-color-scheme: dark`

### View Transitions on Theme Switch

```tsx
if (!document.startViewTransition) {
  setTheme(mode);
  return;
}
document.startViewTransition(() => setTheme(mode));
```

## Live Demo Pattern

The app demonstrates its own transitions. When a user clicks "Try it":

1. `triggerLiveTransition()` injects the transition CSS (with duration/easing applied) into a `<style>` element
2. `document.startViewTransition()` is called, toggling `data-theme` between light↔dark
3. The browser uses the injected CSS for the transition animation
4. After the animation finishes, the injected style is removed

This lives in `src/lib/trigger-transition.ts` and is used by both `TransitionCard` (homepage) and `TransitionPreview` (detail page).

## Build & Deploy

- **Dev**: `pnpm dev` (Vite dev server on port 3000)
- **Build**: `pnpm build` (Vite production build)
- **Deploy**: `pnpm deploy` (builds + Cloudflare Workers deploy via Wrangler)
- **Lint**: `pnpm check` (Biome check) / `pnpm lint` (Biome lint)

## Pages

| Route | Purpose |
|---|---|
| `/` | Homepage — hero with live theme toggle demo, featured mask templates |
| `/templates` | Full template grid with search and category filter |
| `/transition/:slug` | Detail page — live preview, playground, code snippets |

## File Structure

```
transition-app/
├── docs/                    # Documentation set
├── public/                  # Static assets (favicon, manifest)
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components (auto-generated)
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── TransitionCard.tsx
│   │   ├── TransitionPreview.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── FrameworkTabs.tsx
│   │   ├── Playground.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── CopyButton.tsx
│   ├── data/
│   │   └── transitions.ts
│   ├── lib/
│   │   ├── utils.ts         # shadcn cn() utility
│   │   ├── easings.ts
│   │   └── trigger-transition.ts  # Live demo utility
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   ├── templates/
│   │   │   └── index.tsx
│   │   └── transition/
│   │       └── $slug.tsx
│   ├── routeTree.gen.ts     # Auto-generated by TanStack
│   ├── router.tsx
│   └── styles.css
├── biome.json
├── components.json          # shadcn config
├── package.json
├── tsconfig.json
├── vite.config.ts
└── wrangler.jsonc
```
