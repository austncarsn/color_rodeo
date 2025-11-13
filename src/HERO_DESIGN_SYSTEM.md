# Color Rodeo - Hero Section Design System

## Overview
The Color Rodeo hero section features a premium, cinematic dark UI with sophisticated depth effects, glassmorphism, and a warm amber accent color for focal points.

## Visual Hierarchy

### 1. Brand Badge (Top)
```
"Professional Color Tools" badge
- Gradient background: amber-500/10 to cyan-500/10
- Border: amber-500/20
- Pulsing amber dot indicator
- Uppercase text, 12px, tracking-wider
- Color: neutral-300
```

### 2. Logo / Brand Name (Primary)
```
"Color Rodeo"
- Size: 4xl → 5xl → 6xl → 7xl (responsive)
- Gradient text: white → neutral-200 → neutral-400
- Font weight: 500
- Tracking: -0.03em
- Line height: 1.1
- Underline: Gradient divider (transparent → amber-500/50 → transparent)
```

### 3. Tagline (Secondary)
```
"Professional color tools for designers and developers"
- Size: base → lg → xl (responsive)
- Color: neutral-400
- Font weight: 400
- Tracking: wide
- Max width: 36rem (xl)
```

### 4. Control Group (Primary Actions)
```
Glassy container:
- Background: white/[0.03] with backdrop-blur-xl
- Border: white/[0.08]
- Padding: 1.5 (6px)
- Border radius: 2xl (16px)
- Shadow: 2xl
```

### 5. Decorative Color Chips (Accent)
```
5 gradient pills:
- Red → Orange
- Amber → Yellow
- Green → Emerald
- Cyan → Blue
- Purple → Pink
- Opacity: 40%
```

## Background System

### Layer 1: Base Gradient
```css
bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#050505]
```

### Layer 2: Radial Accents
```css
/* Top accent (amber) */
bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_50%)]

/* Bottom-right accent (cyan) */
bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.06),transparent_50%)]
```

### Layer 3: Noise Texture
```css
opacity: 0.015
SVG noise filter with fractalNoise (baseFrequency: 0.9, octaves: 4)
```

### Layer 4: Grid Pattern
```css
opacity: 0.02
radial-gradient dots (1px at 1px intervals)
backgroundSize: 48px × 48px
```

### Layer 5: Vignette
```css
bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]
```

## Button System

### Undo/Redo (Ghost Style)
```
Variant: ghost
- Background: transparent
- Hover: white/[0.08]
- Text: neutral-400 → neutral-200 on hover
- Border: 0
- Min height: 44px
- Padding: px-4 sm:px-5
- Disabled opacity: 30%
- Transition: all 300ms
```

### Shortcuts (Primary Accent)
```
- Background: gradient from amber-500 to amber-600
- Hover: gradient from amber-400 to amber-500
- Text: neutral-900
- Shadow: lg with amber-500/20
- Hover shadow: amber-500/30
- Scale on hover: 105%
- Font weight: 500
- Min height: 44px
- Padding: px-4 sm:px-6
```

### Theme Toggle (Ghost Style)
```
Same as Undo/Redo
- Icons: Moon (dark) / Sun (light)
- Responsive label visibility
```

### Divider
```
Width: 1px
Height: 24px (h-6)
Background: white/[0.08]
```

## Typography Scale

| Element | Mobile | Tablet | Desktop | Large |
|---------|--------|--------|---------|-------|
| Logo | 3xl (30px) | 4xl (36px) | 5xl (48px) | 6xl (60px) → 7xl (72px) |
| Tagline | base (16px) | lg (18px) | xl (20px) | xl (20px) |
| Badge | xs (12px) | xs (12px) | xs (12px) | xs (12px) |
| Buttons | sm | sm | sm | sm |

## Spacing System (8px grid)

### Vertical Rhythm
```
- py-12 (mobile)
- py-16 (small)
- py-20 (desktop)
```

### Element Spacing
```
- Badge to Logo: mb-8 (32px)
- Logo to Tagline: mb-6 (24px)
- Tagline to Controls: mb-10 (40px)
- Controls to Chips: mb-8 (32px)
```

### Control Group
```
- Gap between buttons: gap-2 (8px)
- Gap between groups: gap-3 (12px)
- Button internal padding: px-4 sm:px-5
```

## Color Palette

### Primary Colors
```
Background Dark: #0a0a0a
Surface Dark: #141414
Border: white/[0.08]
Elevated Surface: white/[0.03]
```

### Text Colors
```
Primary: #fafafa (neutral-50)
Secondary: #e5e5e5 (neutral-200)
Tertiary: #a3a3a3 (neutral-400)
Muted: #737373 (neutral-500)
```

### Accent Colors
```
Primary Accent: #f59e0b (amber-500)
Secondary Accent: #22d3ee (cyan-500)
Hover Accent: #fbbf24 (amber-400)
```

### States
```
Hover: white/[0.08]
Active: white/[0.12]
Disabled: opacity-30
```

## Glassmorphism Specs

### Control Container
```css
background: rgba(255, 255, 255, 0.03)
backdrop-filter: blur(12px)
border: 1px solid rgba(255, 255, 255, 0.08)
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### Modal/Dialog
```css
background: gradient from #1a1a1a to #0f0f0f
backdrop-filter: blur(12px)
border: 1px solid rgba(255, 255, 255, 0.08)
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

## Animation Specs

### Button Hover
```
Duration: 300ms
Easing: cubic-bezier (default)
Properties: background, color, scale, shadow
Scale: 105% (primary button only)
```

### Modal Entry
```
Animation: fade-in + slide-in-from-bottom-4
Duration: 300ms
```

### Badge Pulse
```
Element: Amber dot
Animation: animate-pulse (built-in)
```

### Backdrop
```
Animation: fade-in
Duration: 300ms
Background: black/60 with backdrop-blur-sm
```

## Responsive Breakpoints

### Mobile (< 640px)
- Icon-only buttons
- Vertical stacking of control groups
- Smaller logo (3xl → 4xl)
- Reduced padding (py-12, px-4)

### Tablet (640px - 1023px)
- Icon + text buttons
- Horizontal control groups
- Medium logo (5xl)
- Medium padding (py-16, px-6)

### Desktop (1024px+)
- Full button labels
- Optimized spacing
- Large logo (6xl → 7xl)
- Full padding (py-20, px-12)

## Accessibility

### Touch Targets
- Minimum 44×44px for all interactive elements
- 8px minimum spacing between touch targets
- Visual feedback on all interactions

### Contrast Ratios
- Logo gradient: AAA compliance (white → neutral-400)
- Button text: AAA compliance
- Tagline: AA compliance (neutral-400 on dark)
- Badge: AA compliance (neutral-300 on dark)

### Keyboard Navigation
- All buttons fully keyboard accessible
- Visible focus states with ring
- Logical tab order: Badge → Logo → Tagline → Controls → Chips

### Screen Readers
- ARIA labels on icon-only buttons
- Semantic HTML structure
- Proper heading hierarchy (h1 for logo)

## Implementation Notes

### Key CSS Utilities
```
Backdrop blur: backdrop-blur-xl (12px), backdrop-blur-sm (4px)
Opacity for overlays: white/[0.03], white/[0.08]
Gradients: bg-gradient-to-br, bg-gradient-to-r
Shadows: shadow-lg, shadow-2xl, shadow-amber-500/20
Animations: animate-pulse, animate-in, fade-in, slide-in-from-bottom-4
```

### Auto Layout Structure
```
<div> Container (max-w-4xl, mx-auto, text-center)
  <div> Badge (inline-flex)
  <div> Logo section (mb-6)
    <h1> Logo text
    <div> Divider
  <p> Tagline
  <div> Control group (inline-flex)
    <div> Button container (glassy)
      <Button> Undo
      <Button> Redo
      <div> Divider
      <Button> Shortcuts (primary)
    <div> Theme container (glassy)
      <Button> Theme toggle
  <div> Color chips (flex)
```

### Reusability
All button styles are component-based and can be extracted as:
- `GhostButton` (Undo/Redo/Theme)
- `PrimaryButton` (Shortcuts)
- `GlassContainer` (button container, modal)

## Design Tokens

```css
/* Spacing */
--hero-py-mobile: 3rem (48px)
--hero-py-tablet: 4rem (64px)
--hero-py-desktop: 5rem (80px)
--hero-px-mobile: 1rem (16px)
--hero-px-tablet: 1.5rem (24px)
--hero-px-desktop: 3rem (48px)

/* Colors */
--hero-bg-start: #1a1a1a
--hero-bg-mid: #0f0f0f
--hero-bg-end: #050505
--hero-accent-primary: #f59e0b
--hero-accent-secondary: #22d3ee
--hero-text-primary: #fafafa
--hero-text-secondary: #a3a3a3

/* Effects */
--hero-glass-bg: rgba(255, 255, 255, 0.03)
--hero-glass-border: rgba(255, 255, 255, 0.08)
--hero-blur-primary: 12px
--hero-blur-secondary: 4px
```

## Future Enhancements

- [ ] Add parallax effect to background layers on scroll
- [ ] Implement animated gradient shift on hover
- [ ] Add micro-interaction to color chips (subtle scale/glow)
- [ ] Consider animated underline on logo
- [ ] Add optional video background support
- [ ] Implement theme-aware accent colors
