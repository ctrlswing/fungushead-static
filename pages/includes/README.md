# Fungushead Header and Footer Include System

This document explains how the header and footer include system works in the Fungushead website.

## Overview

The website uses a dynamic include system to maintain consistent headers and footers across all pages. This approach:

1. Simplifies maintenance by centralizing header and footer code
2. Ensures consistent navigation and branding across the site
3. Automatically handles path differences between root and subdirectory pages

## How It Works

### Include Files

- `header.html` - The shared header template with placeholder paths
- `footer.html` - The shared footer for pages in subdirectories
- `footer-root.html` - The shared footer for the root page (index.html)

### JavaScript Loading

The `includes.js` file handles loading these components with the correct paths:

1. It detects whether the current page is the root page or a subdirectory page
2. Loads the appropriate include file
3. Adjusts all paths and URLs based on the page location

### Page Structure

Each page should have:

1. The includes.js script in the head:
```html
<script src="../js/includes.js" defer></script>
```

2. A header include placeholder:
```html
<div id="header-include"></div>
```

3. A footer include placeholder:
```html
<div id="footer-include"></div>
```

## Maintaining the System

### Adding New Pages

When adding new pages:

1. Include the `includes.js` script in the head section
2. Add `<div id="header-include"></div>` where the header should be
3. Add `<div id="footer-include"></div>` before the closing body tag
4. Run `./update_all_pages.sh` to ensure all pages are consistent

### Updating the Header or Footer

When you need to update the header or footer:

1. Edit only the include files in `pages/includes/`
2. Use data attributes for paths that differ between root and subdirectory pages:
   - `data-src-root="images/path.jpg"` (for root page)
   - `data-src-pages="../images/path.jpg"` (for subdirectory pages)
3. Use class names for links instead of hardcoded paths (e.g., `class="home-link"`)

## Automated Scripts

The project includes several scripts to maintain consistency:

- `update_header.sh` - Updates all pages to use the header include system
- `update_footer.sh` - Updates all pages to use the footer include system
- `update_all_pages.sh` - Comprehensive script that updates both header and footer includes

Run `./update_all_pages.sh` after adding new pages or making structural changes.

## Troubleshooting

If a page doesn't display the header or footer correctly:

1. Check if `includes.js` is properly included in the page
2. Verify the page has the correct include div IDs
3. Run the update script to fix any consistency issues
4. Check browser console for JavaScript errors 