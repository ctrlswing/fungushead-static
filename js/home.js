/**
 * Fungushead - Home Page Functionality
 * This file contains functions specific to the home page
 */

// Home Page Controller
const HomePage = {
    /**
     * Initialize home page functionality
     */
    init: function() {
        // Load featured products
        this.loadFeaturedProducts();
        
        // Load best sellers
        this.loadBestSellers();
        
        // Load testimonials
        this.loadTestimonials();
        
        // Initialize newsletter form
        this.initNewsletterForm();

        // Initialize mobile menu
        this.initMobileMenu();
    },
    
    /**
     * Initialize mobile menu functionality
     */
    initMobileMenu: function() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenuClose = document.getElementById('mobile-menu-close');
        const mainNavigation = document.getElementById('main-navigation');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        
        // Toggle menu on hamburger icon click
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event from bubbling up
                mainNavigation.classList.add('active');
                mobileMenuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            });
        }
        
        // Close menu on X button click
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event from bubbling up
                mainNavigation.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = ''; // Re-enable scrolling
            });
        }
        
        // Close menu when clicking the overlay
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', function() {
                mainNavigation.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Handle clicks on menu items
        const menuItems = mainNavigation.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                // Only close menu on mobile
                if (window.innerWidth <= 768) {
                    mainNavigation.classList.remove('active');
                    mobileMenuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    },
    
    /**
     * Load featured products
     */
    loadFeaturedProducts: async function() {
        try {
            // Get container element
            const container = document.getElementById('featured-products-container');
            
            if (!container) return;
            
            // Show loading indicator
            container.innerHTML = '<div class="loading">Loading featured products...</div>';
            
            // Get featured products from API
            // In a real implementation, you would use a specific endpoint or parameter for featured products
            // For this demo, we'll use the regular products endpoint with a featured parameter
            const products = await API.getProducts({
                per_page: 4,
                featured: true
            });
            
            // Check if products were found
            if (products.length === 0) {
                container.innerHTML = '<p class="no-products">No featured products found.</p>';
                return;
            }
            
            // Clear container
            container.innerHTML = '';
            
            // Render products
            products.forEach(product => {
                const productCard = this.createProductCard(product);
                container.appendChild(productCard);
            });
        } catch (error) {
            console.error('Error loading featured products:', error);
            
            // Get container element
            const container = document.getElementById('featured-products-container');
            
            if (container) {
                container.innerHTML = '<p class="error">Error loading featured products. Please try again later.</p>';
            }
        }
    },
    
    /**
     * Load best sellers
     */
    loadBestSellers: async function() {
        try {
            // Get container element
            const container = document.getElementById('best-sellers-container');
            
            if (!container) return;
            
            // Show loading indicator
            container.innerHTML = '<div class="loading">Loading best sellers...</div>';
            
            // Get best sellers from API
            // In a real implementation, you would use a specific endpoint or parameter for best sellers
            // For this demo, we'll use the regular products endpoint with a best_selling parameter
            const products = await API.getProducts({
                per_page: 4,
                orderby: 'popularity',
                order: 'desc'
            });
            
            // Check if products were found
            if (products.length === 0) {
                container.innerHTML = '<p class="no-products">No best sellers found.</p>';
                return;
            }
            
            // Clear container
            container.innerHTML = '';
            
            // Render products
            products.forEach(product => {
                const productCard = this.createProductCard(product, 'best-seller');
                container.appendChild(productCard);
            });
        } catch (error) {
            console.error('Error loading best sellers:', error);
            
            // Get container element
            const container = document.getElementById('best-sellers-container');
            
            if (container) {
                container.innerHTML = '<p class="error">Error loading best sellers. Please try again later.</p>';
            }
        }
    },
    
    /**
     * Create product card element
     * @param {Object} product - Product data
     * @param {string} badgeType - Type of badge to display (optional)
     * @return {HTMLElement} - Product card element
     */
    createProductCard: function(product, badgeType = null) {
        // Create product card element
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Get product image URL
        const imageUrl = product.images.length > 0 ? product.images[0].src : 'images/placeholder.jpg';
        
        // Get product price
        const regularPrice = parseFloat(product.regular_price);
        const salePrice = parseFloat(product.sale_price);
        const onSale = salePrice > 0 && salePrice < regularPrice;
        
        // Determine badge type
        let badge = '';
        if (badgeType === 'best-seller') {
            badge = '<span class="product-badge best-seller">Best Seller</span>';
        } else if (onSale) {
            badge = '<span class="product-badge sale">Sale</span>';
        } else if (product.date_created && new Date(product.date_created) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
            badge = '<span class="product-badge new">New</span>';
        }
        
        // Generate HTML for product card
        productCard.innerHTML = `
            <div class="product-image">
                ${badge}
                <img src="${imageUrl}" alt="${product.name}">
                <div class="product-actions">
                    <button class="quick-view-btn" data-product-id="${product.id}" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="add-to-cart-btn" data-product-id="${product.id}" title="Add to Cart">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="wishlist-btn" data-product-id="${product.id}" title="Add to Wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.categories.map(cat => cat.name).join(', ')}</div>
                <h3 class="product-title"><a href="pages/product.html?id=${product.id}">${product.name}</a></h3>
                <div class="product-rating">
                    <div class="stars">${generateStarRating(product.average_rating)}</div>
                    <div class="count">(${product.rating_count})</div>
                </div>
                <div class="product-price">
                    ${onSale ? `<span class="regular-price">${formatPrice(regularPrice)}</span>` : ''}
                    <span class="sale-price">${formatPrice(onSale ? salePrice : regularPrice)}</span>
                </div>
                <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        return productCard;
    },
    
    /**
     * Load testimonials
     */
    loadTestimonials: function() {
        try {
            // Get container element
            const container = document.getElementById('testimonials-container');
            
            if (!container) return;
            
            // Show loading indicator
            container.innerHTML = '<div class="loading">Loading testimonials...</div>';
            
            // In a real implementation, you would fetch testimonials from an API
            // For this demo, we'll use static testimonials
            const testimonials = [
                {
                    id: 1,
                    text: "I've been using Fungushead for all my microscopy needs. Their spore syringes are of exceptional quality, and their customer service is top-notch. Highly recommended!",
                    author: "Michael Johnson",
                    location: "California",
                    rating: 5,
                    avatar: "images/testimonials/avatar1.jpg"
                },
                {
                    id: 2,
                    text: "The Golden Teacher spore syringe I purchased was perfect for my research. The spores were viable and showed excellent characteristics under the microscope. Will definitely order again!",
                    author: "Sarah Williams",
                    location: "Oregon",
                    rating: 5,
                    avatar: "images/testimonials/avatar2.jpg"
                },
                {
                    id: 3,
                    text: "Fast shipping and excellent packaging. The spore prints arrived in perfect condition, and the microscopy results were fascinating. Thank you, Fungushead!",
                    author: "David Thompson",
                    location: "Colorado",
                    rating: 4.5,
                    avatar: "images/testimonials/avatar3.jpg"
                },
                {
                    id: 4,
                    text: "I'm impressed with the variety of strains available. The educational content on the website is also very informative. A great resource for mycology enthusiasts!",
                    author: "Emily Rodriguez",
                    location: "Washington",
                    rating: 5,
                    avatar: "images/testimonials/avatar4.jpg"
                },
                {
                    id: 5,
                    text: "The mix pack was a great value and perfect for my comparative microscopy studies. Each syringe was clearly labeled and contained abundant spores. Will be ordering again soon!",
                    author: "Robert Chen",
                    location: "New York",
                    rating: 4.5,
                    avatar: "images/testimonials/avatar5.jpg"
                }
            ];
            
            // Clear container
            container.innerHTML = '';
            
            // Render testimonials
            testimonials.forEach(testimonial => {
                const testimonialCard = document.createElement('div');
                testimonialCard.className = 'testimonial-card';
                testimonialCard.innerHTML = `
                    <div class="testimonial-content">
                        <div class="testimonial-rating">${generateStarRating(testimonial.rating)}</div>
                        <p class="testimonial-text">${testimonial.text}</p>
                        <div class="testimonial-author">
                            <div class="testimonial-author-image">
                                <img src="${testimonial.avatar}" alt="${testimonial.author}">
                            </div>
                            <div class="testimonial-author-info">
                                <h4>${testimonial.author}</h4>
                                <p>${testimonial.location}</p>
                            </div>
                        </div>
                    </div>
                `;
                
                container.appendChild(testimonialCard);
            });
        } catch (error) {
            console.error('Error loading testimonials:', error);
            
            // Get container element
            const container = document.getElementById('testimonials-container');
            
            if (container) {
                container.innerHTML = '<p class="error">Error loading testimonials. Please try again later.</p>';
            }
        }
    },
    
    /**
     * Initialize newsletter form
     */
    initNewsletterForm: function() {
        // Get newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        
        if (!newsletterForm) return;
        
        // Add submit event listener
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get email input
            const emailInput = newsletterForm.querySelector('input[name="email"]');
            
            if (!emailInput) return;
            
            // Get email value
            const email = emailInput.value.trim();
            
            // Validate email
            if (!email) {
                showNotification('Please enter your email address', 'error');
                return;
            }
            
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            try {
                // Subscribe to newsletter
                await API.subscribeNewsletter(email);
                
                // Show success notification
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                
                // Reset form
                newsletterForm.reset();
            } catch (error) {
                console.error('Error subscribing to newsletter:', error);
                
                // Show error notification
                showNotification('Error subscribing to newsletter. Please try again later.', 'error');
            }
        });
    }
};

// Function to ensure consistent header across all pages
function initializeHeader() {
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mainNavigation = document.getElementById('main-navigation');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNavigation.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            mainNavigation.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function() {
            mainNavigation.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// Initialize header on all pages
document.addEventListener('DOMContentLoaded', function() {
    initializeHeader();
    HomePage.init();
}); 