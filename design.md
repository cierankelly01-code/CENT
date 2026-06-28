# Centaur Robotics — Design System

Reference this file before generating any UI components for this project.

## Brand

Premium, accessible mobility product. Tone: confident, editorial, warm — never clinical or corporate. Think automotive luxury, not medical equipment.

## Colour Tokens

All colours are defined as RGB channel triplets in `app/globals.css` and exposed via Tailwind.

| Token | CSS var | RGB | Use |
|---|---|---|---|
| `bone` | `--color-bone` | `244 241 234` | Page background, light surfaces |
| `ink` | `--color-ink` | `26 23 20` | Body text, dark surfaces |
| `graphite` | `--color-graphite` | `35 32 32` | Dark section backgrounds |
| `bronze` | `--color-bronze` | `176 125 75` | Primary accent, focus rings, highlights |
| `bronze-deep` | `--color-bronze-deep` | `138 94 51` | Eyebrow labels, secondary CTAs |
| `bronze-deeper` | `--color-bronze-deeper` | `111 77 41` | Hover state for bronze-deep CTAs |
| `mist` | `--color-mist` | `218 212 200` | Dividers, subtle borders |

**Rules:**
- Never hardcode hex values — always use Tailwind tokens (`bg-bone`, `text-bronze`, etc.)
- Opacity modifiers work: `text-ink/75`, `bg-bronze/10`
- Focus ring: `2px solid rgb(var(--color-bronze))` — already applied globally via `:focus-visible`

## Typography

| Role | Font | Tailwind class | CSS var |
|---|---|---|---|
| Display / headings | Space Grotesk | `font-display` | `--font-display` |
| Body / UI | Inter | `font-sans` | `--font-body` |

**Usage:**
- All headings: `font-display`
- Body copy, labels, buttons, nav: `font-sans`
- Prose max-width: `max-w-prose` (68ch)
- `antialiased` is set globally on `<body>`

## Spacing & Layout

- Content container: `.container-edge` → `mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12`
- Responsive range: 320px → 1440px

## Component Conventions

**Eyebrow labels** (small category labels above headings):
```tsx
<span className="eyebrow">Pre-order open</span>
// eyebrow = font-sans text-xs font-medium uppercase tracking-[0.22em] text-bronze-deep
```

**Scroll reveal** (fade + translate animation, reduced-motion safe):
```tsx
<div className="reveal">...</div>
// Pair with Reveal.tsx component which adds .is-visible on intersection
```

**Film grain** (cinematic dark sections):
```tsx
<section className="grain relative bg-graphite">...</section>
// Adds subtle noise overlay via ::after pseudo-element
```

**Aurora background** (hero animated glow):
```tsx
<div className="aurora-a absolute ..." />
<div className="aurora-b absolute ..." />
```

**Marquee ticker:**
```tsx
<div className="marquee-track">...</div>
// 28s linear infinite — paused by prefers-reduced-motion
```

## Accessibility (hard gate — WCAG 2.1 AA)

This is a disability product. Accessibility is non-negotiable.

- Focus rings: globally set on `:focus-visible` using bronze
- Skip link: `<a href="#main">Skip to content</a>` in root layout (sr-only until focused)
- Reduced motion: all animations gated with `@media (prefers-reduced-motion: reduce)`
- Kinetic headline animation uses blur+translate only (NOT opacity) — prevents axe mid-fade contrast violations
- axe-core runs in CI on every PR; target 0 violations
- `@axe-core/react` runs in dev mode (browser console) for early feedback

## CTAs & Buttons

- Primary: dark background, bone text, bronze hover/focus
- Secondary: bronze-deep text, transparent bg, border
- Hover on bronze-deep CTAs → bronze-deeper (`#6F4D29`)
- All interactive elements: `focus-visible` outline via global styles (no per-component focus styles needed)

## Guardrails

- No medical/clinical/health claims
- No off-road capability claims (smooth-surface only)
- No invented funding figures, partner names, or trial results
- Placeholder copy flagged `CLIENT —` or `TBC` until client supplies real content
