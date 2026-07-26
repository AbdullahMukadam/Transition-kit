# Transition App — Contributing Guide

## Adding a New Transition Template

### Step 1: Define the Transition

Add a new entry to `src/data/transitions.ts`:

```ts
{
  slug: "my-transition",
  name: "My Transition",
  description: "A brief description of what this transition does.",
  category: "simple", // "simple" | "mask" | "3d" | "composite"
  browsers: "Chrome 111+, Edge 111+",
  css: `::view-transition-old(root) { ... }`,
  js: `document.startViewTransition(() => { ... })`,
  frameworks: {
    vanilla: `// Vanilla JS code...`,
    react: `// React code...`,
    nextjs: `// Next.js code...`,
    vue: `// Vue code...`,
    svelte: `// Svelte code...`,
  },
  config: {
    duration: 400,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    direction: "left", // optional, for slide-type transitions
  },
  previewColors: {
    from: "#4fb8b2",
    to: "#2f6a4a",
  },
}
```

### Step 2: Choose a Category

| Category | When to Use |
|---|---|
| `simple` | Opacity, translate, scale — single-property animations |
| `mask` | Mask-image, clip-path — reveal-based transitions |
| `3d` | Perspective, rotateX/Y — 3D transforms |
| `composite` | Combines multiple techniques (blur + scale, etc.) |

### Step 3: Write the CSS

The CSS must use `::view-transition-old(root)` and `::view-transition-new(root)` pseudo-elements. Keyframe names should be unique (prefix with the transition slug).

Template:
```css
::view-transition-old(root) {
  animation: {slug}-out {duration} {easing} both;
}
::view-transition-new(root) {
  animation: {slug}-in {duration} {easing} both;
}
@keyframes {slug}-out {
  from { /* start state */ }
  to { /* end state */ }
}
@keyframes {slug}-in {
  from { /* start state */ }
  to { /* end state */ }
}
```

For mask transitions, use `::view-transition-new(root)` with `mask` property.

### Step 4: Write Framework Snippets

Each framework snippet should show how to apply this transition in a typical project:

- **Vanilla JS**: `document.startViewTransition()` with the CSS
- **React**: Component pattern with `useTransition` or `startViewTransition`
- **Next.js**: App Router integration with route events
- **Vue**: Composition API with `onBeforeRouteLeave`
- **Svelte`: `onNavigate` lifecycle

### Step 5: Update Documentation

1. Add the transition to `docs/TRANSITIONS.md` following the existing format
2. Update the count in `docs/PRD.md` if the total changed

### Step 6: Verify

1. The transition appears on the homepage grid
2. The transition loads correctly on `/transition/{slug}`
3. Live preview works with "Play" button
4. All 6 code tabs show correct, highlighted code
5. Playground controls affect the preview
6. Works in light and dark mode
7. `pnpm check` and `pnpm lint` pass

---

## Code Conventions

- **Formatter**: Biome — tabs, double quotes
- **Linter**: Biome recommended rules
- **Components**: Default exports, PascalCase filenames
- **TypeScript**: Strict mode, no unused locals/params
- **Imports**: Use `@/` alias for `src/` paths

## File Naming

- Components: `PascalCase.tsx` (e.g., `TransitionCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `easings.ts`)
- Data: `camelCase.ts` (e.g., `transitions.ts`)
- Routes: TanStack file-based naming (`index.tsx`, `$slug.tsx`)
