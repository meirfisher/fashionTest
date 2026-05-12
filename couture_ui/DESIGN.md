---
name: Couture Editorial
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#4d4635'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#7f7663'
  outline-variant: '#d0c5af'
  surface-tint: '#735c00'
  primary: '#735c00'
  on-primary: '#ffffff'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#e9c349'
  secondary: '#80534c'
  on-secondary: '#ffffff'
  secondary-container: '#ffc3bb'
  on-secondary-container: '#7b4e48'
  tertiary: '#5d5e60'
  on-tertiary: '#ffffff'
  tertiary-container: '#b2b3b5'
  on-tertiary-container: '#434547'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#f3b8b0'
  on-secondary-fixed: '#32120e'
  on-secondary-fixed-variant: '#653c36'
  tertiary-fixed: '#e2e2e4'
  tertiary-fixed-dim: '#c6c6c8'
  on-tertiary-fixed: '#1a1c1d'
  on-tertiary-fixed-variant: '#454749'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.15em
  data-mono:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 80px
  margin-tablet: 40px
  margin-mobile: 20px
---

## Brand & Style
The design system embodies the high-fashion editorial essence of a luxury magazine. It targets a sophisticated audience that values curation, understated elegance, and "quiet luxury." The emotional response is one of calm aspiration—airy, expensive, and meticulously composed.

The style is a hybrid of **Minimalism** and **Glassmorphism**. It prioritizes vast white space (negative space) and a rhythmic editorial flow. Digital elements utilize white glassmorphism with high-density backdrop blurs to simulate frosted acrylic or silk overlays, while thin metallic accents provide a tactile, jewelry-like precision to the interface.

## Colors
The palette is rooted in a "Soft Beige" (#F5F5F7) base, which acts as the high-quality paper stock of the digital experience. 

- **Primary (Champagne Gold):** Used sparingly for high-level highlights, interactive states, or premium signifiers.
- **Secondary (Muted Rose):** Utilized for delicate UI hairline strokes, subtle button states, and decorative icons.
- **Text (Deep Charcoal):** Provides high-contrast legibility without the harshness of pure black, maintaining a refined "ink-on-paper" feel.
- **Glassmorphism:** Surfaces use semi-transparent white with high saturation/blur to create depth without introducing new colors.

## Typography
The typography relies on a dramatic contrast between the classical serif and the modern sans-serif.

- **Playfair Display:** Used for all expressive headings. It should be typeset with generous leading and occasionally slight negative letter-spacing for large display titles to mimic high-end mastheads.
- **Hanken Grotesk:** A clean, geometric sans-serif used for all functional data, body copy, and navigation labels. It provides a technical, "chic" balance to the romanticism of the serif.
- **Styling Note:** Use "Label Caps" for navigation and small categories to evoke the look of a luxury fashion catalog.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to maintain editorial integrity, transitioning to a fluid model on smaller screens. 

- **Grid:** A 12-column grid with wide margins (80px+) to ensure the content feels "airy" and centered as a masterpiece.
- **Rhythm:** Utilize an 8px base unit but favor large vertical gaps (64px, 80px, 120px) between sections to prevent visual clutter.
- **Asymmetry:** Occasionally break the grid with images or text offsets to create the "magazine" feel, ensuring that white space is treated as a functional element rather than empty space.

## Elevation & Depth
Depth in this design system is achieved through light refraction and layering rather than heavy shadows.

- **The Glass Layer:** Elevated components (modals, floating menus, navigation bars) use a white glassmorphic effect. This involves a `backdrop-filter: blur(20px)` and a background color of `white` at 70% opacity.
- **Soft Focus:** Background elements should appear slightly out of focus when a primary modal is active, creating a "bokeh" effect.
- **Shadows:** Use only one type of shadow: a very faint, highly diffused ambient "glow" (`0 20px 40px rgba(45, 45, 45, 0.05)`).
- **Lines:** Depth is also defined by thin 1px rose-gold or champagne lines that separate sections without adding visual weight.

## Shapes
The shape language is "Organic Geometric." While the grid is rigid, the elements within it are soft.

- **Corner Radius:** Standard buttons and cards use a 0.5rem (8px) radius. Larger container modules or "hero" images use `rounded-xl` (1.5rem / 24px) to feel more like smooth pebbles or organic forms.
- **Circular Elements:** Avatars and secondary action buttons are fully pill-shaped or circular to contrast with the rectangular nature of text blocks.
- **Thin Borders:** Borders should never exceed 1px. They should feel like a fine metallic thread.

## Components
- **Buttons:** Primary buttons are either Deep Charcoal with white text (bold) or Champagne Gold with a subtle shimmer effect. Secondary buttons are "Ghost" style with a 1px Muted Rose border.
- **Cards:** Cards do not use heavy borders. They are defined by the white glassmorphism effect against the beige background, with a subtle 1px white inner-stroke for "rim lighting."
- **Input Fields:** Minimalist underlines in Muted Rose rather than full boxes. Labels use the "Label Caps" typography style.
- **Chips:** Small, pill-shaped tags with a 10% opacity Muted Rose background and Muted Rose text.
- **Specialty Component (The Lookbook Slider):** A horizontal image slider with thin, oversized Rose Gold arrow icons and a centered Playfair Display caption below each frame.
- **Lists:** Cleanly separated by 1px horizontal Champagne Gold hair-lines with generous vertical padding (24px).