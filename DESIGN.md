---
version: "alpha"
name: "FlowOps - Surgical Precision"
description: "Flowops Surgical Dashboard Section is designed for demonstrating application workflows and interface hierarchy. Key features include clear information density, modular panels, and interface rhythm. It is suitable for product showcases, admin panels, and analytics experiences."
colors:
  primary: "#111827"
  secondary: "#FFEDD5"
  tertiary: "#E0E7FF"
  neutral: "#FFFFFF"
  background: "#FFFFFF"
  surface: "#E5E7EB"
  text-primary: "#6B7280"
  text-secondary: "#111827"
  border: "#FFFFFF"
  accent: "#111827"
typography:
  display-lg:
    fontFamily: "Inter"
    fontSize: "88px"
    fontWeight: 500
    lineHeight: "96.8px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: "22.75px"
  label-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
    letterSpacing: "0.35px"
rounded:
  md: "0px"
  full: "9999px"
spacing:
  base: "4px"
  sm: "2.4px"
  md: "4px"
  lg: "6px"
  xl: "8px"
  gap: "6px"
  card-padding: "8px"
  section-padding: "24px"
components:
  button-primary:
    textColor: "{colors.neutral}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "10px"
  button-link:
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0px"
  card:
    backgroundColor: "{colors.neutral}"
    rounded: "32px"
    padding: "8px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Full Bleed
  - Framing: Glassy
  - Grid: Strong

## Colors

The color system uses light mode with #111827 as the main accent and #FFFFFF as the neutral foundation.

- **Primary (#111827):** Main accent and emphasis color.
- **Secondary (#FFEDD5):** Supporting accent for secondary emphasis.
- **Tertiary (#E0E7FF):** Reserved accent for supporting contrast moments.
- **Neutral (#FFFFFF):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #FFFFFF; Surface: #E5E7EB; Text Primary: #6B7280; Text Secondary: #111827; Border: #FFFFFF; Accent: #111827

- **Gradients:** bg-gradient-to-b from-white to-transparent via-transparent, bg-gradient-to-b from-transparent to-white/80, bg-gradient-to-r from-transparent to-transparent via-red-900/10, bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-100/30 to-transparent via-transparent

## Typography

Typography relies on Inter across display, body, and utility text.

- **Display (`display-lg`):** Inter, 88px, weight 500, line-height 96.8px, letter-spacing -0.025em.
- **Body (`body-md`):** Inter, 14px, weight 300, line-height 22.75px.
- **Labels (`label-md`):** Inter, 14px, weight 500, line-height 20px, letter-spacing 0.35px.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, full bleed structural frame before changing ornament or component styling. Use 4px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Full Bleed
- **Base unit:** 4px
- **Scale:** 2.4px, 4px, 6px, 8px, 10px, 12px, 14px, 16px
- **Section padding:** 24px, 64px, 88px
- **Card padding:** 8px, 9px, 16px, 17px
- **Gaps:** 6px, 8px, 12px, 16px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 0.8px #FFFFFF; 1.6px #FFFFFF; 1.6px #6496FF; 0.8px #E0E7FF
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 1px 1px -0.5px, rgba(0, 0, 0, 0.06) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.06) 0px 6px 6px -3px, rgba(0, 0, 0, 0.06) 0px 12px 12px -6px, rgba(0, 0, 0, 0.06) 0px 24px 24px -12px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px; rgba(0, 0, 0, 0.4) 0px 12px 24px -6px, rgba(255, 255, 255, 0.15) 0px 1px 1px 0px inset, rgba(0, 0, 0, 0.5) 0px -2px 3px 0px inset, rgba(0, 0, 0, 0.1) 0px 0px 0px 1px
- **Blur:** 4px, 12px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 0px padding and a 0px radius. Drive the shell with linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0) 1px) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 4px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 4px, 28px, 32px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles. Reuse the existing card surface recipe for content blocks.

### Buttons
- **Primary:** text #FFFFFF, radius 9999px, padding 10px, border 0px solid rgb(229, 231, 235).
- **Links:** text #6B7280, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Cards and Surfaces
- **Card surface:** background #FFFFFF, border 0px solid rgb(229, 231, 235), radius 32px, padding 8px, shadow rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 1px 1px -0.5px, rgba(0, 0, 0, 0.06) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.06) 0px 6px 6px -3px, rgba(0, 0, 0, 0.06) 0px 12px 12px -6px, rgba(0, 0, 0, 0.06) 0px 24px 24px -12px.
- **Card surface:** border 0px solid rgb(229, 231, 235), radius 0px, padding 24px, shadow none.
- **Card surface:** background rgba(255, 255, 255, 0.9), border 0.8px solid rgb(255, 255, 255), radius 16px, padding 16px, shadow rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.04) 0px 8px 30px 0px, blur 4px.

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 4px, 28px, 32px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected expressive motion intensity without a deliberate reason.

## Motion

Motion feels expressive but remains focused on interface, text, and layout transitions. Timing clusters around 150ms and 3000ms. Easing favors ease and cubic-bezier(0.4. Hover behavior focuses on text and transform changes.

**Motion Level:** expressive

**Durations:** 150ms, 3000ms, 500ms, 4000ms, 6000ms, 300ms

**Easings:** ease, cubic-bezier(0.4, 0, 0.2, 1), ease-in-out

**Hover Patterns:** text, transform
