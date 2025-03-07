# Fungushead Static Site with WooCommerce Integration

This project is a static HTML/CSS/JavaScript implementation of the Fungushead e-commerce website, designed to connect to a WooCommerce backend via REST API.

## Overview

The site is built as a static frontend that communicates with WooCommerce's REST API for dynamic functionality such as product listings, cart management, checkout, and user authentication. The design closely matches the original Fungushead website while allowing for customization.

## Features

- **Product Display:** Dynamically fetches and displays WooCommerce products
- **Cart Functionality:** Enables adding, removing, and updating items in the cart
- **User Authentication:** Implements WooCommerce login and registration
- **Checkout Process:** Integrates with Paymonix payment gateway
- **Blog Integration:** Fetches and displays WordPress blog posts
- **Responsive Design:** Optimized for all device sizes

## Project Structure

```
fungushead-static/
├── css/                  # CSS stylesheets
│   ├── normalize.css     # CSS reset
│   ├── main.css          # Global styles
│   ├── home.css          # Home page styles
│   └── ...               # Other page-specific styles
├── js/                   # JavaScript files
│   ├── config.js         # Configuration and utilities
│   ├── api.js            # API service for WooCommerce
│   ├── cart.js           # Cart functionality
│   └── ...               # Page-specific scripts
├── images/               # Image assets
├── pages/                # HTML pages
│   ├── shop.html         # Shop page
│   ├── product.html      # Product detail page
│   ├── cart.html         # Cart page
│   ├── checkout.html     # Checkout page
│   └── ...               # Other pages
└── index.html            # Home page
```

## Setup Instructions

### Prerequisites

- Web server (Apache, Nginx, etc.) or local development server
- WooCommerce site with REST API enabled
- API keys for WooCommerce REST API

### Installation

1. Clone or download this repository to your web server or local environment
2. Configure the API settings in `js/config.js`:
   ```javascript
   const CONFIG = {
       api: {
           baseUrl: 'https://your-woocommerce-site.com/wp-json/wc/v3',
           consumerKey: 'YOUR_CONSUMER_KEY',
           consumerSecret: 'YOUR_CONSUMER_SECRET',
           // ...
       },
       // ...
   };
   ```
3. Update any site-specific settings in the configuration file
4. If using a local development server, start the server and navigate to the site

### API Configuration

To connect to your WooCommerce site:

1. In your WordPress admin, go to WooCommerce > Settings > Advanced > REST API
2. Add a new key with Read/Write permissions
3. Copy the Consumer Key and Consumer Secret
4. Paste these values in the `js/config.js` file

## Paymonix Integration

The checkout process is designed to redirect to the Paymonix payment gateway. To configure this:

1. Ensure the Paymonix plugin is installed on your WooCommerce site
2. Configure the Paymonix settings in your WooCommerce admin
3. The static site will automatically redirect to Paymonix during checkout

## Customization

### Styling

The site uses CSS variables for easy customization. Main colors and styling parameters can be modified in `css/main.css`:

```css
:root {
    --primary-color: #3e885b;
    --secondary-color: #8e44ad;
    --accent-color: #f39c12;
    /* ... */
}
```

### Adding Pages

To add new pages:

1. Create a new HTML file in the `pages/` directory
2. Use the existing pages as templates
3. Link to your new page from the navigation menu
4. Create any necessary CSS and JavaScript files

## Browser Compatibility

The site is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Development Notes

### Local Storage

For demonstration purposes, this implementation uses localStorage to simulate cart and user data persistence. In a production environment, this would be handled by the WooCommerce API.

### API Simulation

Some API endpoints are simulated in the `api.js` file. In a production environment, these would be replaced with actual API calls to the WooCommerce REST API.

### Security Considerations

- In a production environment, API authentication should be handled securely
- API keys should never be exposed in client-side code
- Consider implementing a proxy server for API requests

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- Design inspired by the original Fungushead website
- Icons from Font Awesome
- Normalize.css by Nicolas Gallagher 