# Fungushead CSS Structure

This document outlines the CSS structure for the Fungushead website.

## CSS Files Organization

The CSS for the Fungushead website is organized into three main files:

1. **global.css** - Contains all site-wide styles
2. **components.css** - Contains styles for reusable UI components
3. **pages.css** - Contains page-specific styles

## File Contents

### global.css

This file contains:
- CSS reset/normalize
- Typography (font-family, font sizes, line-height)
- Colors (variables for primary, secondary, accent colors)
- Layout basics (margin, padding, spacing)
- Button base styles
- Form element base styles
- Utility classes (margin, padding, text alignment, colors, etc.)

### components.css

This file contains styles for reusable UI components:
- Header & Navigation
- Footer
- Cart Sidebar
- Product Cards
- Form Components
- Responsive adjustments for components

### pages.css

This file contains page-specific styles:
- Page header template
- Section headers
- Home page specific styles
- Shop page specific styles
- Product page specific styles
- Cart page specific styles
- Checkout page specific styles
- Account page specific styles
- Blog page specific styles
- Responsive adjustments for page layouts

## CSS Variables

CSS variables are defined in `global.css` and used throughout all CSS files. This ensures consistency in:
- Colors
- Typography
- Spacing
- Breakpoints

## Responsive Design

The responsive design is implemented using:
- Fluid layouts with flexbox and grid
- Media queries at standard breakpoints:
  - 1024px (tablet landscape)
  - 768px (tablet portrait)
  - 576px (mobile)

## Best Practices

- Use CSS variables for consistency
- Keep selectors as simple as possible
- Group related styles together
- Use comments to organize sections
- Follow a consistent naming convention
- Minimize specificity conflicts
- Optimize for reusability 