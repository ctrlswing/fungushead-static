/**
 * Fungushead - Configuration
 * This file contains configuration settings for the Fungushead website
 */

const CONFIG = {
    // API Settings
    api: {
        // WooCommerce REST API Base URL
        // Replace with your actual WooCommerce site URL
        baseUrl: 'https://fungusheadshop.com/wp-json/wc/v3',
        
        // WooCommerce API Keys
        // IMPORTANT: Replace these with your actual API keys
        // These are placeholder values and will not work
        consumerKey: 'YOUR_CONSUMER_KEY',
        consumerSecret: 'YOUR_CONSUMER_SECRET',
        
        // WordPress REST API Base URL for blog posts
        wpBaseUrl: 'https://fungusheadshop.com/wp-json/wp/v2',
        
        // Endpoints
        endpoints: {
            // Products
            products: '/products',
            productCategories: '/products/categories',
            productTags: '/products/tags',
            
            // Cart
            cart: '/cart',
            cartAdd: '/cart/add-item',
            cartUpdate: '/cart/update-item',
            cartRemove: '/cart/remove-item',
            
            // Checkout
            checkout: '/checkout',
            
            // Customer
            customers: '/customers',
            
            // Orders
            orders: '/orders',
            
            // Authentication
            token: '/token',
            validateToken: '/token/validate',
            
            // Blog
            posts: '/posts',
            categories: '/categories',
            tags: '/tags',
            
            // Paymonix Redirect URL
            // This is where the checkout will redirect for payment processing
            paymonixRedirect: '/checkout/paymonix-redirect'
        }
    },
    
    // Site Settings
    site: {
        name: 'Fungushead',
        currency: 'USD',
        currencySymbol: '$',
        decimalPlaces: 2,
        
        // Default pagination settings
        pagination: {
            productsPerPage: 12,
            postsPerPage: 10
        },
        
        // Default sorting options
        sorting: {
            products: 'popularity', // Options: popularity, price-low, price-high, newest
            posts: 'date-desc' // Options: date-desc, date-asc, title-asc, title-desc
        }
    },
    
    // Local Storage Keys
    storage: {
        cart: 'fungushead_cart',
        user: 'fungushead_user',
        token: 'fungushead_token',
        recentlyViewed: 'fungushead_recently_viewed'
    },
    
    // Feature Flags
    features: {
        enableCart: true,
        enableWishlist: true,
        enableCompare: false,
        enableReviews: true,
        enableBlog: true,
        enableNewsletter: true
    }
};

/**
 * Format price according to site currency settings
 * @param {number} price - The price to format
 * @return {string} - Formatted price with currency symbol
 */
function formatPrice(price) {
    if (typeof price !== 'number') {
        price = parseFloat(price) || 0;
    }
    
    return CONFIG.site.currencySymbol + price.toFixed(CONFIG.site.decimalPlaces);
}

/**
 * Format date to a readable string
 * @param {string} dateString - The date string to format
 * @return {string} - Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Generate star rating HTML
 * @param {number} rating - The rating value (0-5)
 * @return {string} - HTML for star rating
 */
function generateStarRating(rating) {
    if (typeof rating !== 'number') {
        rating = parseFloat(rating) || 0;
    }
    
    // Ensure rating is between 0 and 5
    rating = Math.max(0, Math.min(5, rating));
    
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let html = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
    }
    
    return html;
}

/**
 * Truncate text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length
 * @return {string} - Truncated text
 */
function truncateText(text, length = 100) {
    if (!text) return '';
    
    if (text.length <= length) {
        return text;
    }
    
    return text.substring(0, length) + '...';
}

/**
 * Get URL parameters as an object
 * @return {Object} - URL parameters as key-value pairs
 */
function getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    
    if (queryString) {
        const pairs = queryString.split('&');
        
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    }
    
    return params;
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 * @param {number} duration - How long to show the notification in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Check if notification container exists, create if not
    let container = document.getElementById('notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon fas ${getIconForType(type)}"></i>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Style the notification
    notification.style.backgroundColor = getColorForType(type);
    notification.style.color = '#fff';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.marginBottom = '10px';
    notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    notification.style.display = 'flex';
    notification.style.justifyContent = 'space-between';
    notification.style.alignItems = 'center';
    notification.style.minWidth = '300px';
    notification.style.maxWidth = '400px';
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = '#fff';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '16px';
    
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Add to container
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after duration
    setTimeout(() => {
        removeNotification(notification);
    }, duration);
    
    // Helper function to remove notification with animation
    function removeNotification(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 300);
    }
    
    // Helper function to get icon for notification type
    function getIconForType(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'info':
            default: return 'fa-info-circle';
        }
    }
    
    // Helper function to get color for notification type
    function getColorForType(type) {
        switch (type) {
            case 'success': return '#27ae60';
            case 'error': return '#e74c3c';
            case 'warning': return '#f39c12';
            case 'info':
            default: return '#3498db';
        }
    }
}

// Export utilities for use in other scripts
window.CONFIG = CONFIG;
window.formatPrice = formatPrice;
window.formatDate = formatDate;
window.generateStarRating = generateStarRating;
window.truncateText = truncateText;
window.getUrlParams = getUrlParams;
window.showNotification = showNotification; 