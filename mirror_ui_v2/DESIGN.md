---
name: Soft Elegance Aesthetic
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#50453b'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#82756a'
  outline-variant: '#d4c4b7'
  surface-tint: '#7d562d'
  primary: '#7d562d'
  on-primary: '#ffffff'
  primary-container: '#d4a373'
  on-primary-container: '#5b3912'
  inverse-primary: '#f0bd8b'
  secondary: '#715858'
  on-secondary: '#ffffff'
  secondary-container: '#fddada'
  on-secondary-container: '#785e5e'
  tertiary: '#5e5e5d'
  on-tertiary: '#ffffff'
  tertiary-container: '#acacab'
  on-tertiary-container: '#3f403f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcbd'
  primary-fixed-dim: '#f0bd8b'
  on-primary-fixed: '#2c1600'
  on-primary-fixed-variant: '#623f18'
  secondary-fixed: '#fddada'
  secondary-fixed-dim: '#dfbfbf'
  on-secondary-fixed: '#291717'
  on-secondary-fixed-variant: '#584141'
  tertiary-fixed: '#e3e2e0'
  tertiary-fixed-dim: '#c7c6c5'
  on-tertiary-fixed: '#1a1c1b'
  on-tertiary-fixed-variant: '#464746'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '300'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.08em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '300'
    lineHeight: '1.1'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

This design system embodies a sophisticated, minimalist fashion aesthetic that prioritizes airiness and tactile softness. The target audience is discerning and values quiet luxury, requiring a UI that feels like a high-end editorial spread. 

The style is a hybrid of **Minimalism** and **Light Glassmorphism**. It relies on expansive whitespace, deliberate high-contrast typography, and ethereal layers. Surfaces should feel semi-translucent, as if etched from frosted glass or fine silk, creating a sense of depth without clutter. The emotional response is one of calm, exclusivity, and effortless grace.

## Colors

The palette is anchored by a warm, ivory foundation to avoid the sterility of pure white. High-contrast typography ensures legibility and a modern edge.

- **Background:** Soft Ivory (#F9F8F6) serves as the primary canvas for all views.
- **Text:** Dark Espresso (#1A1A1A) provides sharp, clear contrast for all editorial and functional content.
- **Primary Action:** Champagne (#D4A373) is used for high-importance interactions and focal points.
- **Secondary Action:** Muted Rose (#E7C6C6) provides a softer touch for toggle states, secondary buttons, and decorative highlights.
- **Surface:** A semi-transparent white (Alpha 40-60%) is used for glassmorphic cards to maintain the ivory undertone.

## Typography

This design system utilizes a single, highly-refined Sans-Serif typeface (Inter) to maintain a structured and contemporary feel. The hierarchy is driven by extreme scale and generous line-heights rather than heavy weights.

- **Display & Headlines:** Use light and regular weights. Tracking is slightly tightened for larger sizes to maintain a "locked-in" editorial look.
- **Body Text:** Ample line-height (1.6) is mandatory to preserve the "airy" feel of the system.
- **Labels:** Small caps and increased tracking are used for metadata and utility labels to differentiate them from body copy without increasing weight.

## Layout & Spacing

The layout philosophy is a **Fixed Grid** centered on the screen for desktop, transitioning to a fluid margin-based system for mobile.

- **Grid:** A 12-column grid is used for desktop (1280px max-width). For mobile, a 4-column grid with 16px side margins is standard.
- **Rhythm:** An 8px soft-grid governs all spacing. However, vertical section spacing should lean toward the larger end of the scale (xxl) to encourage a minimalist, unhurried user flow.
- **Margins:** Large internal paddings within cards and containers (minimum 32px) ensure content never feels cramped.

## Elevation & Depth

Depth in this design system is achieved through **Glassmorphism** and **Ambient Shadows** rather than traditional stacking.

- **Surfaces:** Use a `backdrop-filter: blur(12px)` on all floating containers and navigation bars. The background of these elements should be a highly transparent version of the Soft Ivory color.
- **Shadows:** Use extremely diffused, low-opacity shadows. A typical shadow should have a large blur radius (30px-50px) and a very low opacity (3-5%) with a slight tint of the Primary color to maintain warmth.
- **Outlines:** Use a 1px solid border with 10% opacity of the Dark Espresso color to provide a "ghost border" definition for glass elements.

## Shapes

The shape language is restrained and architectural. 

- **Corner Radii:** We use a "Soft" (0.25rem) approach for most components to maintain a clean, structured look. 
- **Large Containers:** Cards and modal dialogs may use `rounded-lg` (0.5rem) to slightly soften the presence of large blocks of content.
- **Buttons:** Maintain the 4px (0.25rem) radius. Do not use pill-shapes, as they conflict with the sophisticated, structured aesthetic.

## Components

- **Buttons:** Primary actions use a solid Champagne background with Dark Espresso text. Secondary actions use an outline-only style or a Muted Rose text-link style.
- **Inputs:** Minimalist bottom-border-only fields or very light ivory-filled fields with 1px soft borders. Focus states transition the border to Champagne.
- **Cards:** Glassmorphic backgrounds with the 1px ghost border. Ensure the blur is sufficient to keep text legible over background imagery.
- **Chips/Tags:** Use the Muted Rose color at 15% opacity with Dark Espresso text for a soft, tonal look.
- **Lists:** High-contrast text with generous 24px vertical padding between items, separated by a 1px hairline divider in 5% Espresso.
- **Navigation:** Top-tier navigation should always be a glassmorphic bar that remains fixed, allowing the content to softly blur as it scrolls underneath.