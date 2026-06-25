---
name: Industrial Precision System
colors:
  surface: '#f6faff'
  surface-dim: '#d2dbe4'
  surface-bright: '#f6faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf5fe'
  surface-container: '#e6eff8'
  surface-container-high: '#e0e9f2'
  surface-container-highest: '#dbe4ed'
  on-surface: '#141d23'
  on-surface-variant: '#46474a'
  inverse-surface: '#293138'
  inverse-on-surface: '#e9f2fb'
  outline: '#76777b'
  outline-variant: '#c7c6ca'
  surface-tint: '#5f5e5f'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1c'
  on-primary-container: '#858384'
  inverse-primary: '#c8c6c7'
  secondary: '#206393'
  on-secondary: '#ffffff'
  secondary-container: '#90c9ff'
  on-secondary-container: '#035584'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001f23'
  on-tertiary-container: '#3b8f9a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e3'
  primary-fixed-dim: '#c8c6c7'
  on-primary-fixed: '#1b1b1c'
  on-primary-fixed-variant: '#474647'
  secondary-fixed: '#cee5ff'
  secondary-fixed-dim: '#96ccff'
  on-secondary-fixed: '#001d32'
  on-secondary-fixed-variant: '#004a75'
  tertiary-fixed: '#9ff0fb'
  tertiary-fixed-dim: '#82d3de'
  on-tertiary-fixed: '#001f23'
  on-tertiary-fixed-variant: '#004f56'
  background: '#f6faff'
  on-background: '#141d23'
  surface-variant: '#dbe4ed'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  sidebar_width: 260px
  container_margin: 24px
  gutter: 16px
  unit: 4px
  card_padding: 20px
---

## Brand & Style
The design system is engineered for high-stakes industrial environments where data integrity and clarity are paramount. The aesthetic is **Corporate / Modern** with a lean toward **Minimalism**, emphasizing a "software-as-a-tool" philosophy. It evokes reliability and expertise through a structured, high-density layout that avoids decorative trends like glassmorphism or vibrant glows. 

The visual language communicates authority and precision, using a disciplined color palette and rigorous alignment to ensure engineers can parse complex chemical and mechanical data without cognitive fatigue. The tone is sober, evidence-based, and premium—positioning the dashboard as a mission-critical piece of enterprise infrastructure.

## Colors
The palette is rooted in industrial materials: graphite, steel, and slate. 

- **Primary & Neutrals**: Graphite (#1a1a1b) serves as the primary text and navigation color, providing maximum contrast against the off-white (#f8f9fa) background. Slate (#3c3c3c) is reserved for subtle borders and secondary UI elements.
- **Functional Accents**: 
    - **Natural Ester**: Muted Deep Green (#2d5a27) is used exclusively for biological/natural oil data points.
    - **Synthetic Ester**: Muted Steel Blue (#4682b4) identifies synthetic chemical data.
    - **Warnings**: Amber (#d97706) is used for caution states, ensuring visibility without the "panic" of bright red.
- **Data Visualization**: Deep Teal (#006d77) provides a sophisticated third dimension for complex charting without breaking the professional tone.

## Typography
**Inter** is the workhorse of the design system, chosen for its exceptional legibility in data-heavy interfaces and its neutral, modern tone. 

- **Hierarchies**: Use tight line heights for headlines to maintain a compact, industrial feel. 
- **Technical Data**: A secondary monospaced font (**JetBrains Mono**) is introduced specifically for numeric values, sensor readings, and chemical formulas to ensure character alignment and rapid scanning of changing digits.
- **Labels**: Small-caps are utilized for section headers and table column titles to differentiate them from interactive data points.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. A permanent left sidebar (260px) houses primary navigation, while the main content area utilizes a 12-column grid that scales to fill the viewport.

- **Rhythm**: A strict 4px baseline grid ensures vertical consistency.
- **Density**: This is a high-density system. Gutters are kept at 16px to maximize information real estate while maintaining enough "breathing room" to prevent data overlap.
- **Breakpoints**:
    - **Desktop (1440px+)**: Full 12-column visibility.
    - **Tablet (768px - 1439px)**: Sidebar collapses to icons; grid shifts to 6 columns.
    - **Mobile (<767px)**: Single column stack; hidden sidebar accessible via "hamburger" menu.

## Elevation & Depth
This design system rejects physical realism in favor of **Tonal Layering** and **Low-Contrast Outlines**.

- **Surfaces**: The primary background is the soft off-white (#f8f9fa). Cards and interactive containers use a pure white surface.
- **Borders**: Depth is primarily communicated through 1px solid borders in Muted Steel Blue or Slate at low opacities (10-15%). 
- **Shadows**: Only one level of shadow is permitted: a "Technical Lift" used for dropdowns and active modals. It is a sharp, low-blur shadow (0px 4px 12px) with a heavy tint of the Slate neutral to ground the element in the UI.
- **Hierarchy**: Higher priority information is not "higher" in elevation, but rather framed with a slightly thicker left-hand border in a functional accent color (e.g., Natural Ester green).

## Shapes
In keeping with the industrial theme, the shape language is **Soft (0.25rem)**. This provides a subtle modern touch that prevents the UI from feeling dated or overly "harsh," while maintaining the structural integrity of a professional tool. 

- **Primary Buttons & Inputs**: 4px (0.25rem) corner radius.
- **Cards & Layout Modules**: 8px (0.5rem) corner radius for larger containers to create clear grouping.
- **Status Indicators**: Status "pips" or dots remain perfectly circular to differentiate them from interactive rectangular buttons.

## Components
- **Buttons**: Primary buttons are solid Graphite with white text. Secondary buttons use a Slate outline. Ghost buttons are reserved for low-priority actions in the sidebar.
- **Technical Cards**: Feature a 1px border. They must include a "Header" area with a Label-Caps title and an optional monospaced "Unit of Measure" indicator.
- **Input Fields**: Default state uses a 1px Slate border. Focus state shifts the border to Muted Steel Blue with a subtle 2px inset ring. No outer glows.
- **Chips/Badges**: Small, 4px rounded rectangles. Used for categorization (Natural vs. Synthetic). Backgrounds are highly desaturated versions of the accent colors (10% opacity) with full-strength text.
- **Data Tables**: Zebra-striping is omitted. Instead, use thin horizontal dividers and high-contrast monospaced numbers. Hover states on rows should use a very light tint of Muted Steel Blue.
- **Sidebar**: The background is a solid Graphite (#1a1a1b) with Muted Steel Blue used for the active menu state indicator (a vertical bar on the left edge).