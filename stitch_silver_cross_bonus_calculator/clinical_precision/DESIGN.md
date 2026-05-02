---
name: Clinical Precision
colors:
  surface: '#fcf8fd'
  surface-dim: '#dcd9de'
  surface-bright: '#fcf8fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f7'
  surface-container: '#f1ecf2'
  surface-container-high: '#ebe7ec'
  surface-container-highest: '#e5e1e6'
  on-surface: '#1c1b1f'
  on-surface-variant: '#47464f'
  inverse-surface: '#313034'
  inverse-on-surface: '#f3eff4'
  outline: '#787680'
  outline-variant: '#c8c5d0'
  surface-tint: '#5b598c'
  primary: '#070235'
  on-primary: '#ffffff'
  primary-container: '#1e1b4b'
  on-primary-container: '#8683ba'
  inverse-primary: '#c4c1fb'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#160700'
  on-tertiary: '#ffffff'
  tertiary-container: '#371a00'
  on-tertiary-container: '#ae7f59'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c4c1fb'
  on-primary-fixed: '#181445'
  on-primary-fixed-variant: '#444173'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffdcc2'
  tertiary-fixed-dim: '#f1bc91'
  on-tertiary-fixed: '#2e1500'
  on-tertiary-fixed-variant: '#633e1e'
  background: '#fcf8fd'
  on-background: '#1c1b1f'
  surface-variant: '#e5e1e6'
typography:
  h1:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  currency:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container_max_width: 1024px
  card_padding: 24px
  element_height: 40px
  gutter: 16px
  stack_gap: 12px
  section_margin: 32px
---

## Brand & Style
The brand personality is rooted in clinical reliability, efficiency, and transparency. Designed for the pharmaceutical and healthcare sector, the interface prioritizes clarity of information over decorative elements. 

The design style follows **Minimalism** with a **Corporate/Modern** influence. It utilizes high-quality typography and generous whitespace to reduce cognitive load during complex data entry or inventory management. The aesthetic is "surgical"—clean, organized, and intentional, evoking a sense of calm and professional trust.

## Colors
This design system utilizes a restricted palette to maintain a professional medical atmosphere. 

- **Background:** A soft slate-gray (#f8fafc) provides a low-contrast foundation that reduces eye strain.
- **Surface:** Pure white (#ffffff) is reserved for interactive cards and containers to create a clear "layered" effect.
- **Primary Accent:** Deep slate / indigo (#1e1b4b) is used for headers, primary actions, and brand identification.
- **Muted Text:** Gray-500 (#6b7280) is applied to labels, placeholders, and secondary information.
- **Destructive:** A clear red (#ef4444) identifies critical deletions or warnings.

## Typography
**Inter** is the sole typeface, chosen for its exceptional legibility in data-heavy environments. 

- **Headings:** Use semi-bold weights with slight negative letter-spacing for a modern, compact look.
- **Body:** Use regular weight for maximum readability. 
- **Currency:** Financial figures (₹) should use a medium weight to stand out slightly from standard body text. Always display two decimal places for precision.
- **Labels:** Small, uppercase labels with increased letter-spacing are used for category headers and metadata.

## Layout & Spacing
The layout follows a **Fixed grid** model centered within the viewport.

- **Container:** The main content area is constrained to a maximum width of 1024px.
- **Responsive Behavior:** On mobile devices, columns stack vertically, and horizontal padding reduces to 16px.
- **Rhythm:** A base-8 spacing system is used. Card padding is strictly 24px to ensure "generous whitespace." 
- **Consistency:** All primary interactive elements (buttons, inputs, select menus) share a uniform height of 40px to create a rhythmic alignment across forms.

## Elevation & Depth
This design system uses a combination of **Tonal Layers** and **Ambient Shadows** to establish hierarchy.

- **Level 0 (Background):** #f8fafc slate background.
- **Level 1 (Cards/Surfaces):** White surfaces with a 1px subtle border (#e2e8f0).
- **Shadows:** Cards use a very soft, diffused shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)`.
- **Interaction:** On hover, buttons and interactive cards may slightly deepen their shadow to signal "lift" without becoming visually heavy.

## Shapes
The shape language is structured and dependable. 

- **Corners:** A standard `rounded-lg` (8px) radius is applied to all buttons, input fields, and cards. This softens the "clinical" feel enough to be modern while maintaining a geometric, professional structure.
- **Borders:** All borders are kept at a consistent 1px width using a light slate-gray to define boundaries without adding visual noise.

## Components

- **Buttons:** 40px height. Primary buttons use the Deep Slate background with white text. Secondary buttons use a white background with a 1px border.
- **Input Fields:** 40px height. Use white background and #e2e8f0 border. On focus, the border shifts to the primary indigo. Muted text (#6b7280) is used for placeholders.
- **Cards:** The core container. Must have 24px internal padding and 8px corner radius. Used for grouping patient data, drug information, or analytics.
- **Chips/Badges:** Small 24px height pills with a light tinted background and 12px font for status indicators (e.g., "In Stock", "Expired").
- **Lists:** Clean rows with 1px bottom borders. High contrast for titles and muted text for secondary details (e.g., Batch Numbers, Expiry).
- **Data Tables:** Minimalist approach with no vertical lines; only horizontal dividers to separate entries.
- **Currency Display:** Prefixed with ₹. Bold the integer part, keep the two decimal places at regular weight for subtle hierarchy.