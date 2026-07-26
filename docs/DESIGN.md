# Transition App — Design System

## Design Language

The app follows Vercel's **Geist** design system: minimal, high-contrast, whitespace-heavy, with restrained color and near-neutral surfaces. Color signals state and hierarchy, never decoration.

## Color Tokens

### Geist Gray Scale (sRGB)

| Token | Hex | Usage |
|---|---|---|
| `gray-100` | `#f2f2f2` | Default background |
| `gray-200` | `#ebebeb` | Hover background |
| `gray-300` | `#e6e6e6` | Active background |
| `gray-400` | `#eaeaea` | Default border |
| `gray-500` | `#c9c9c9` | Hover border |
| `gray-600` | `#a8a8a8` | Active border |
| `gray-700` | `#8f8f8f` | Disabled text |
| `gray-800` | `#7d7d7d` | — |
| `gray-900` | `#4d4d4d` | Secondary text/icons |
| `gray-1000` | `#171717` | Primary text/icons |

### Geist Alpha Scale (translucent gray)

| Token | Value | Usage |
|---|---|---|
| `gray-alpha-100` | `#0000000d` | — |
| `gray-alpha-200` | `#00000015` | — |
| `gray-alpha-300` | `#0000001a` | — |
| `gray-alpha-400` | `#00000014` | Default border (translucent) |
| `gray-alpha-500` | `#00000036` | Hover border (translucent) |
| `gray-alpha-600` | `#0000003d` | Active border (translucent) |
| `gray-alpha-700` | `#00000070` | — |
| `gray-alpha-800` | `#00000082` | — |
| `gray-alpha-900` | `#000000b3` | — |
| `gray-alpha-1000` | `#000000e8` | — |

### Geist Accent Colors

| Scale | Primary | Fallback | Usage |
|---|---|---|---|
| Blue | `#006bff` | `blue-700` | Links, focus rings, success |
| Red | `#fc0035` | `red-700` | Errors |
| Amber | `#ffa600` | `amber-600` | Warnings |
| Green | `#28a948` | `green-700` | — |
| Teal | `#00ac96` | `teal-700` | — |
| Purple | `#a000f8` | `purple-700` | — |
| Pink | `#f22782` | `pink-700` | — |

Each accent scale runs 100–1000. Steps encode intent:
- `100` default background
- `200` hover background
- `300` active background
- `400` default border
- `500` hover border
- `600` active border
- `700` solid fill, high contrast
- `800` solid fill, hover
- `900` secondary text/icons
- `1000` primary text/icons

### Semantic Tokens (shadcn mapping)

| shadcn Token | Light Value | Dark Value | Usage |
|---|---|---|---|
| `--background` | `#ffffff` | Geist dark bg | Page background |
| `--foreground` | `#171717` | Geist dark fg | Primary text |
| `--card` | `#ffffff` | Geist dark surface | Card backgrounds |
| `--card-foreground` | `#171717` | Geist dark fg | Card text |
| `--primary` | `#171717` | Geist dark primary | Primary actions |
| `--primary-foreground` | `#ffffff` | — | Text on primary |
| `--secondary` | `#f2f2f2` | Geist dark secondary | Secondary backgrounds |
| `--secondary-foreground` | `#4d4d4d` | — | Secondary text |
| `--muted` | `#f2f2f2` | — | Muted backgrounds |
| `--muted-foreground` | `#8f8f8f` | — | Muted text |
| `--accent` | `#006bff` | Geist dark blue | Accent elements |
| `--border` | `#eaeaea` | Geist dark border | Borders |
| `--input` | `#eaeaea` | — | Input borders |
| `--ring` | `#006bff` | — | Focus rings |

## Typography

### Font Families

| Role | Font | Source |
|---|---|---|
| UI & Body | Geist Sans | `@fontsource-variable/geist` |
| Code & Mono | Geist Mono | `@fontsource-variable/geist-mono` |

### Typography Scale

| Token | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| `heading-48` | Geist Sans | 48px | 600 | 56px | -2.88px |
| `heading-40` | Geist Sans | 40px | 600 | 48px | -2.4px |
| `heading-32` | Geist Sans | 32px | 600 | 40px | -1.28px |
| `heading-24` | Geist Sans | 24px | 600 | 32px | -0.96px |
| `heading-20` | Geist Sans | 20px | 600 | 26px | -0.4px |
| `heading-16` | Geist Sans | 16px | 600 | 24px | -0.32px |
| `heading-14` | Geist Sans | 14px | 600 | 20px | -0.28px |
| `copy-16` | Geist Sans | 16px | 400 | 24px | — |
| `copy-14` | Geist Sans | 14px | 400 | 20px | — |
| `copy-13` | Geist Sans | 13px | 400 | 18px | — |
| `label-14` | Geist Sans | 14px | 400 | 20px | — |
| `label-13` | Geist Sans | 13px | 400 | 16px | — |
| `label-12` | Geist Sans | 12px | 400 | 16px | — |
| `button-14` | Geist Sans | 14px | 500 | 20px | — |
| `button-12` | Geist Sans | 12px | 500 | 16px | — |
| `code-14` | Geist Mono | 14px | 400 | 20px | — |
| `code-13` | Geist Mono | 13px | 400 | 18px | — |

## Spacing & Layout

- **Scale**: 4px base — 4, 8, 12, 16, 24, 32, 40, 64, 96px
- **Rhythm**: 8px inside groups, 16px between groups, 32–40px between sections
- **Card padding**: 24px (compact 16px, hero 32px)
- **Content width**: 1200px centered column
- **Breakpoints**: `sm` 401px, `md` 601px, `lg` 961px, `xl` 1200px, `2xl` 1400px

## Shapes

| Token | Value | Usage |
|---|---|---|
| `rounded-sm` | 6px | Controls, buttons, inputs |
| `rounded-md` | 12px | Menus, modals |
| `rounded-lg` | 16px | Fullscreen surfaces |
| `rounded-full` | 9999px | Pills, avatars, circular |

Keep one radius family per view. Do not mix rounded and sharp corners.

## Elevation & Depth

Hierarchy comes from tonal surfaces and borders first. Shadows stay subtle.

| Level | Box Shadow | Usage |
|---|---|---|
| Raised cards | `0 2px 2px rgba(0,0,0,0.04)` | Cards, panels |
| Popovers | `0 1px 1px rgba(0,0,0,0.02), 0 4px 8px -4px rgba(0,0,0,0.04), 0 16px 24px -8px rgba(0,0,0,0.06)` | Menus, tooltips |
| Modals | `0 1px 1px rgba(0,0,0,0.02), 0 8px 16px -4px rgba(0,0,0,0.04), 0 24px 32px -8px rgba(0,0,0,0.06)` | Dialogs |

## Motion

Use motion only when it clarifies a change, never for decoration. Most interactions should feel instant (`0ms`). When motion helps:
- State changes: ~150ms
- Popovers/tooltips: ~200ms
- Overlays/modals: ~300ms
- Easing: `cubic-bezier(0.175, 0.885, 0.32, 1.1)`
- Honor `prefers-reduced-motion` by dropping nonessential animation

## Components

### Buttons

| Variant | Background | Text | Border | Height |
|---|---|---|---|---|
| Primary | `gray-1000` | `#ffffff` | none | 40px |
| Secondary | `#ffffff` | `gray-1000` | `gray-alpha-400` | 40px |
| Tertiary | transparent | `gray-1000` | none | 40px |
| Small | — | — | — | 32px |
| Large | — | — | — | 48px |

Hover steps: `100` → `200` (fill), borders `400` → `500` → `600`.
Disabled: `gray-100` fill, `gray-700` text, `not-allowed` cursor.
Focus: `0 0 0 2px #ffffff, 0 0 0 4px #006bff` (two-layer ring).

### Inputs

- Background: `#ffffff`
- Border: translucent `gray-alpha-400`
- Radius: 6px
- Height: 40px (small 32px, large 48px)

## Voice & Copy

- Title Case for labels, buttons, titles, tabs
- Sentence case for body, helper text, toasts
- Name actions with verb + noun (`Deploy Project`, not `Confirm`)
- Use numerals (`3 projects`), curly quotes, ellipsis character
