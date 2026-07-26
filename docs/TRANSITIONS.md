# Transition App — Transition Templates Catalog

## Overview

Each template provides a complete page transition using the View Transitions API. Templates include CSS keyframes, JavaScript usage, and framework-specific integration snippets.

## Browser Support

The View Transitions API is supported in:
- Chrome 111+
- Edge 111+
- Opera 97+

Not supported in Firefox or Safari as of July 2026. All templates include a graceful fallback.

## Templates

### 1. Circle Reveal ⭐ Featured

| Property | Value |
|---|---|
| **Slug** | `circle-reveal` |
| **Category** | Mask |
| **Description** | Expanding circular mask reveals the new theme from the center |
| **Default Duration** | 1000ms |
| **Default Easing** | ease-in-out |
| **Technique** | SVG circle mask with animated `mask-size` |

### 2. Circle Blur ⭐ Featured

| Property | Value |
|---|---|
| **Slug** | `circle-blur` |
| **Category** | Mask |
| **Description** | Circular mask with gaussian blur for a soft, diffused reveal |
| **Default Duration** | 1000ms |
| **Default Easing** | cubic-bezier(0.16, 1, 0.3, 1) |
| **Technique** | SVG circle mask with `feGaussianBlur` filter |

### 3. Circle Blur Top Left ⭐ Featured

| Property | Value |
|---|---|
| **Slug** | `circle-blur-top-left` |
| **Category** | Mask |
| **Description** | Blur mask pivoted to the top-left corner for an asymmetric reveal |
| **Default Duration** | 1000ms |
| **Default Easing** | cubic-bezier(0.16, 1, 0.3, 1) |
| **Technique** | SVG circle at origin with blur, `mask-origin: content-box` |

### 4. Polygon Reveal ⭐ Featured

| Property | Value |
|---|---|
| **Slug** | `polygon-reveal` |
| **Category** | Mask |
| **Description** | Clip-path polygon animates a geometric wipe to reveal the new theme |
| **Default Duration** | 700ms |
| **Default Easing** | cubic-bezier(0.16, 1, 0.3, 1) |
| **Technique** | Animated `clip-path: polygon()` |

### 5. Fade

| Property | Value |
|---|---|
| **Slug** | `fade` |
| **Category** | Simple |
| **Description** | Smooth opacity crossfade between old and new page content |
| **Default Duration** | 300ms |
| **Default Easing** | ease-in-out |
| **Technique** | Opacity animation on `::view-transition-old` and `::view-transition-new` |

### 6. Slide Left

| Property | Value |
|---|---|
| **Slug** | `slide-left` |
| **Category** | Simple |
| **Description** | Old page slides out to the left, new page slides in from the right |
| **Default Duration** | 400ms |
| **Default Easing** | cubic-bezier(0.4, 0, 0.2, 1) |
| **Technique** | TranslateX animation on old/new pseudo-elements |

### 7. Slide Up

| Property | Value |
|---|---|
| **Slug** | `slide-up` |
| **Category** | Simple |
| **Description** | Old page slides down and out, new page slides up from below |
| **Default Duration** | 400ms |
| **Default Easing** | cubic-bezier(0.4, 0, 0.2, 1) |
| **Technique** | TranslateY animation on old/new pseudo-elements |

### 8. Scale

| Property | Value |
|---|---|
| **Slug** | `scale` |
| **Category** | Simple |
| **Description** | New page scales up from center while old page fades out |
| **Default Duration** | 500ms |
| **Default Easing** | cubic-bezier(0.16, 1, 0.3, 1) |
| **Technique** | Scale transform + opacity on pseudo-elements |

### 9. Flip

| Property | Value |
|---|---|
| **Slug** | `flip` |
| **Category** | 3D |
| **Description** | 3D card flip on the Y-axis to reveal new page |
| **Default Duration** | 600ms |
| **Default Easing** | ease-in-out |
| **Technique** | `rotateY` with `perspective(1200px)` on old/new |

### 10. Blur

| Property | Value |
|---|---|
| **Slug** | `blur` |
| **Category** | Composite |
| **Description** | Old page blurs and fades while new page sharpens in |
| **Default Duration** | 500ms |
| **Default Easing** | ease-in-out |
| **Technique** | `filter: blur()` + opacity + slight scale |

---

## Adding New Transitions

See `docs/CONTRIBUTING.md` for the process of adding a new transition template.

### Required Fields

Each new transition must provide:
1. `slug` — URL-safe identifier
2. `name` — Display name
3. `description` — One-line description
4. `category` — One of: `simple`, `mask`, `3d`, `composite`
5. `browsers` — Browser support string
6. `css` — Complete CSS solution
7. `js` — JavaScript usage example
8. `frameworks` — Object with `vanilla`, `react`, `nextjs`, `vue`, `svelte` snippets
9. `config` — Default `{ duration, easing, direction? }`
10. `previewColors` — `{ from, to }` colors for preview elements
11. `featured` — Optional boolean for homepage highlight
