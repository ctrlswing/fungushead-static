/**
 * Fungushead - API Service
 * This file contains functions for interacting with the WooCommerce REST API
 */

// API Service Object
const API = {
    /**
     * Make a request to the WooCommerce REST API
     * @param {string} endpoint - API endpoint
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
     * @param {Object} data - Request data (for POST, PUT)
     * @param {boolean} useWpApi - Whether to use WordPress API instead of WooCommerce API
     * @return {Promise} - Promise resolving to the API response
     */
    request: async function(endpoint, method = 'GET', data = null, useWpApi = false) {
        try {
            // Determine base URL
            const baseUrl = useWpApi ? CONFIG.api.wpBaseUrl : CONFIG.api.baseUrl;
            
            // Build URL with authentication
            let url = `${baseUrl}${endpoint}`;
            
            // Add authentication parameters for WooCommerce API
            if (!useWpApi) {
                // In a real implementation, you would use OAuth 1.0a for WooCommerce REST API
                // For this static demo, we'll simulate authentication with query parameters
                url += (url.includes('?') ? '&' : '?') + 
                      `consumer_key=${CONFIG.api.consumerKey}&consumer_secret=${CONFIG.api.consumerSecret}`;
            }
            
            // Set up request options
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            // Add authentication token for WordPress API if available
            if (useWpApi) {
                const token = localStorage.getItem(CONFIG.storage.token);
                if (token) {
                    options.headers['Authorization'] = `Bearer ${token}`;
                }
            }
            
            // Add request body for POST and PUT requests
            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }
            
            // Make the request
            const response = await fetch(url, options);
            
            // Parse response
            const responseData = await response.json();
            
            // Check for errors
            if (!response.ok) {
                throw new Error(responseData.message || 'API request failed');
            }
            
            return responseData;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    },
    
    /**
     * Get products from the API
     * @param {Object} params - Query parameters
     * @return {Promise} - Promise resolving to products data
     */
    getProducts: async function(params = {}) {
        // Default parameters
        const defaultParams = {
            per_page: CONFIG.site.pagination.productsPerPage,
            page: 1,
            orderby: 'popularity',
            order: 'desc'
        };
        
        // Merge default parameters with provided parameters
        const queryParams = { ...defaultParams, ...params };
        
        // Convert parameters to query string
        const queryString = Object.entries(queryParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
        
        // Make the request
        return this.request(`${CONFIG.api.endpoints.products}?${queryString}`);
    },
    
    /**
     * Get a single product by ID
     * @param {number} id - Product ID
     * @return {Promise} - Promise resolving to product data
     */
    getProduct: async function(id) {
        return this.request(`${CONFIG.api.endpoints.products}/${id}`);
    },
    
    /**
     * Get product categories
     * @param {Object} params - Query parameters
     * @return {Promise} - Promise resolving to categories data
     */
    getProductCategories: async function(params = {}) {
        // Default parameters
        const defaultParams = {
            per_page: 100,
            orderby: 'name',
            order: 'asc'
        };
        
        // Merge default parameters with provided parameters
        const queryParams = { ...defaultParams, ...params };
        
        // Convert parameters to query string
        const queryString = Object.entries(queryParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
        
        // Make the request
        return this.request(`${CONFIG.api.endpoints.productCategories}?${queryString}`);
    },
    
    /**
     * Get products by category
     * @param {number} categoryId - Category ID
     * @param {Object} params - Additional query parameters
     * @return {Promise} - Promise resolving to products data
     */
    getProductsByCategory: async function(categoryId, params = {}) {
        return this.getProducts({ category: categoryId, ...params });
    },
    
    /**
     * Search products
     * @param {string} query - Search query
     * @param {Object} params - Additional query parameters
     * @return {Promise} - Promise resolving to products data
     */
    searchProducts: async function(query, params = {}) {
        return this.getProducts({ search: query, ...params });
    },
    
    /**
     * Get related products
     * @param {number} productId - Product ID
     * @param {number} limit - Number of related products to get
     * @return {Promise} - Promise resolving to related products data
     */
    getRelatedProducts: async function(productId, limit = 4) {
        // In a real implementation, you would use the WooCommerce API's related products endpoint
        // For this static demo, we'll simulate it by getting products from the same category
        
        try {
            // Get the product to find its categories
            const product = await this.getProduct(productId);
            
            // Extract category IDs
            const categoryIds = product.categories.map(category => category.id);
            
            // If no categories, return empty array
            if (categoryIds.length === 0) {
                return [];
            }
            
            // Get products from the first category
            const relatedProducts = await this.getProducts({
                category: categoryIds[0],
                per_page: limit + 1, // Get one extra to filter out the current product
                exclude: [productId]
            });
            
            // Return the related products
            return relatedProducts.slice(0, limit);
        } catch (error) {
            console.error('Error getting related products:', error);
            return [];
        }
    },
    
    /**
     * Get blog posts
     * @param {Object} params - Query parameters
     * @return {Promise} - Promise resolving to posts data
     */
    getPosts: async function(params = {}) {
        // Default parameters
        const defaultParams = {
            per_page: CONFIG.site.pagination.postsPerPage,
            page: 1,
            _embed: true // Include featured images and other embedded content
        };
        
        // Merge default parameters with provided parameters
        const queryParams = { ...defaultParams, ...params };
        
        // Convert parameters to query string
        const queryString = Object.entries(queryParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
        
        // Make the request using WordPress API
        return this.request(`${CONFIG.api.endpoints.posts}?${queryString}`, 'GET', null, true);
    },
    
    /**
     * Get a single blog post by ID
     * @param {number} id - Post ID
     * @return {Promise} - Promise resolving to post data
     */
    getPost: async function(id) {
        return this.request(`${CONFIG.api.endpoints.posts}/${id}?_embed=true`, 'GET', null, true);
    },
    
    /**
     * Get blog categories
     * @return {Promise} - Promise resolving to blog categories data
     */
    getBlogCategories: async function() {
        return this.request(`${CONFIG.api.endpoints.categories}`, 'GET', null, true);
    },
    
    /**
     * Get posts by category
     * @param {number} categoryId - Category ID
     * @param {Object} params - Additional query parameters
     * @return {Promise} - Promise resolving to posts data
     */
    getPostsByCategory: async function(categoryId, params = {}) {
        return this.getPosts({ categories: categoryId, ...params });
    },
    
    /**
     * Search blog posts
     * @param {string} query - Search query
     * @param {Object} params - Additional query parameters
     * @return {Promise} - Promise resolving to posts data
     */
    searchPosts: async function(query, params = {}) {
        return this.getPosts({ search: query, ...params });
    },
    
    /**
     * Get cart contents
     * @return {Promise} - Promise resolving to cart data
     */
    getCart: async function() {
        // In a real implementation, you would use the WooCommerce API's cart endpoint
        // For this static demo, we'll use localStorage to simulate a cart
        
        try {
            const cartData = localStorage.getItem(CONFIG.storage.cart);
            
            if (!cartData) {
                // Initialize empty cart if none exists
                const emptyCart = {
                    items: [],
                    totals: {
                        subtotal: 0,
                        discount: 0,
                        shipping: 0,
                        total: 0
                    }
                };
                
                localStorage.setItem(CONFIG.storage.cart, JSON.stringify(emptyCart));
                return emptyCart;
            }
            
            return JSON.parse(cartData);
        } catch (error) {
            console.error('Error getting cart:', error);
            return {
                items: [],
                totals: {
                    subtotal: 0,
                    discount: 0,
                    shipping: 0,
                    total: 0
                }
            };
        }
    },
    
    /**
     * Add item to cart
     * @param {number} productId - Product ID
     * @param {number} quantity - Quantity to add
     * @param {Object} variation - Variation data (if applicable)
     * @return {Promise} - Promise resolving to updated cart data
     */
    addToCart: async function(productId, quantity = 1, variation = null) {
        try {
            // Get current cart
            const cart = await this.getCart();
            
            // Get product data
            const product = await this.getProduct(productId);
            
            // Check if product already exists in cart
            const existingItemIndex = cart.items.findIndex(item => 
                item.product_id === productId && 
                JSON.stringify(item.variation || {}) === JSON.stringify(variation || {})
            );
            
            if (existingItemIndex !== -1) {
                // Update quantity if product already exists
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item if product doesn't exist in cart
                cart.items.push({
                    product_id: productId,
                    product_name: product.name,
                    product_image: product.images.length > 0 ? product.images[0].src : '',
                    price: parseFloat(product.price),
                    regular_price: parseFloat(product.regular_price),
                    quantity: quantity,
                    variation: variation
                });
            }
            
            // Recalculate totals
            this.calculateCartTotals(cart);
            
            // Save updated cart
            localStorage.setItem(CONFIG.storage.cart, JSON.stringify(cart));
            
            return cart;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },
    
    /**
     * Update cart item quantity
     * @param {number} itemIndex - Index of the item in the cart
     * @param {number} quantity - New quantity
     * @return {Promise} - Promise resolving to updated cart data
     */
    updateCartItem: async function(itemIndex, quantity) {
        try {
            // Get current cart
            const cart = await this.getCart();
            
            // Check if item exists
            if (itemIndex < 0 || itemIndex >= cart.items.length) {
                throw new Error('Item not found in cart');
            }
            
            // Update quantity
            if (quantity <= 0) {
                // Remove item if quantity is 0 or negative
                cart.items.splice(itemIndex, 1);
            } else {
                // Update quantity
                cart.items[itemIndex].quantity = quantity;
            }
            
            // Recalculate totals
            this.calculateCartTotals(cart);
            
            // Save updated cart
            localStorage.setItem(CONFIG.storage.cart, JSON.stringify(cart));
            
            return cart;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    },
    
    /**
     * Remove item from cart
     * @param {number} itemIndex - Index of the item in the cart
     * @return {Promise} - Promise resolving to updated cart data
     */
    removeCartItem: async function(itemIndex) {
        return this.updateCartItem(itemIndex, 0);
    },
    
    /**
     * Clear the cart
     * @return {Promise} - Promise resolving to empty cart data
     */
    clearCart: async function() {
        try {
            // Initialize empty cart
            const emptyCart = {
                items: [],
                totals: {
                    subtotal: 0,
                    discount: 0,
                    shipping: 0,
                    total: 0
                }
            };
            
            // Save empty cart
            localStorage.setItem(CONFIG.storage.cart, JSON.stringify(emptyCart));
            
            return emptyCart;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    },
    
    /**
     * Calculate cart totals
     * @param {Object} cart - Cart object to update
     */
    calculateCartTotals: function(cart) {
        // Calculate subtotal
        cart.totals.subtotal = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        // Apply discount (if any)
        // For this demo, we'll assume no discount
        cart.totals.discount = 0;
        
        // Calculate shipping (simplified for demo)
        cart.totals.shipping = cart.items.length > 0 ? 5.00 : 0;
        
        // Calculate total
        cart.totals.total = cart.totals.subtotal - cart.totals.discount + cart.totals.shipping;
    },
    
    /**
     * Create an order
     * @param {Object} orderData - Order data
     * @return {Promise} - Promise resolving to order data
     */
    createOrder: async function(orderData) {
        try {
            // In a real implementation, you would send this to the WooCommerce API
            // For this static demo, we'll simulate it
            
            // Get cart data
            const cart = await this.getCart();
            
            // Create order object
            const order = {
                id: Math.floor(Math.random() * 1000000), // Generate random order ID
                number: `FH-${Date.now()}`, // Generate order number
                status: 'pending',
                date_created: new Date().toISOString(),
                total: cart.totals.total.toString(),
                line_items: cart.items.map(item => ({
                    product_id: item.product_id,
                    name: item.product_name,
                    quantity: item.quantity,
                    price: item.price.toString(),
                    total: (item.price * item.quantity).toString()
                })),
                shipping: {
                    first_name: orderData.shipping.first_name,
                    last_name: orderData.shipping.last_name,
                    address_1: orderData.shipping.address_1,
                    address_2: orderData.shipping.address_2 || '',
                    city: orderData.shipping.city,
                    state: orderData.shipping.state,
                    postcode: orderData.shipping.postcode,
                    country: orderData.shipping.country
                },
                billing: {
                    first_name: orderData.billing.first_name,
                    last_name: orderData.billing.last_name,
                    address_1: orderData.billing.address_1,
                    address_2: orderData.billing.address_2 || '',
                    city: orderData.billing.city,
                    state: orderData.billing.state,
                    postcode: orderData.billing.postcode,
                    country: orderData.billing.country,
                    email: orderData.billing.email,
                    phone: orderData.billing.phone
                },
                payment_method: orderData.payment_method,
                payment_method_title: orderData.payment_method === 'paymonix' ? 'Paymonix Payment Gateway' : 'Other Payment Method',
                customer_note: orderData.customer_note || '',
                meta_data: []
            };
            
            // Store order in localStorage for demo purposes
            const orders = JSON.parse(localStorage.getItem('fungushead_orders') || '[]');
            orders.push(order);
            localStorage.setItem('fungushead_orders', JSON.stringify(orders));
            
            // Clear cart after successful order
            await this.clearCart();
            
            return order;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },
    
    /**
     * Get Paymonix redirect URL
     * @param {number} orderId - Order ID
     * @return {string} - Paymonix redirect URL
     */
    getPaymonixRedirectUrl: function(orderId) {
        // In a real implementation, this would be generated by the WooCommerce Paymonix plugin
        // For this demo, we'll simulate it
        return `https://paymonix.com/checkout?order_id=${orderId}&merchant=fungushead&timestamp=${Date.now()}`;
    },
    
    /**
     * User login
     * @param {string} username - Username or email
     * @param {string} password - Password
     * @return {Promise} - Promise resolving to user data
     */
    login: async function(username, password) {
        try {
            // In a real implementation, you would use the WordPress REST API for authentication
            // For this static demo, we'll simulate it
            
            // Simulate successful login
            const userData = {
                id: 1,
                username: username,
                email: username.includes('@') ? username : `${username}@example.com`,
                first_name: 'Demo',
                last_name: 'User',
                display_name: 'Demo User',
                token: `demo_token_${Date.now()}`
            };
            
            // Store user data in localStorage
            localStorage.setItem(CONFIG.storage.user, JSON.stringify(userData));
            localStorage.setItem(CONFIG.storage.token, userData.token);
            
            return userData;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    },
    
    /**
     * User registration
     * @param {string} email - Email address
     * @param {string} password - Password
     * @return {Promise} - Promise resolving to user data
     */
    register: async function(email, password) {
        try {
            // In a real implementation, you would use the WordPress REST API for registration
            // For this static demo, we'll simulate it
            
            // Simulate successful registration
            const userData = {
                id: 1,
                username: email.split('@')[0],
                email: email,
                first_name: '',
                last_name: '',
                display_name: email.split('@')[0],
                token: `demo_token_${Date.now()}`
            };
            
            // Store user data in localStorage
            localStorage.setItem(CONFIG.storage.user, JSON.stringify(userData));
            localStorage.setItem(CONFIG.storage.token, userData.token);
            
            return userData;
        } catch (error) {
            console.error('Error registering:', error);
            throw error;
        }
    },
    
    /**
     * User logout
     * @return {Promise} - Promise resolving to success status
     */
    logout: async function() {
        try {
            // Remove user data from localStorage
            localStorage.removeItem(CONFIG.storage.user);
            localStorage.removeItem(CONFIG.storage.token);
            
            return { success: true };
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    },
    
    /**
     * Check if user is logged in
     * @return {boolean} - Whether user is logged in
     */
    isLoggedIn: function() {
        return !!localStorage.getItem(CONFIG.storage.token);
    },
    
    /**
     * Get current user data
     * @return {Object|null} - User data or null if not logged in
     */
    getCurrentUser: function() {
        try {
            const userData = localStorage.getItem(CONFIG.storage.user);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },
    
    /**
     * Update user account details
     * @param {Object} userData - User data to update
     * @return {Promise} - Promise resolving to updated user data
     */
    updateUserAccount: async function(userData) {
        try {
            // In a real implementation, you would use the WordPress REST API
            // For this static demo, we'll simulate it
            
            // Get current user data
            const currentUser = this.getCurrentUser();
            
            if (!currentUser) {
                throw new Error('User not logged in');
            }
            
            // Update user data
            const updatedUser = {
                ...currentUser,
                ...userData
            };
            
            // Store updated user data
            localStorage.setItem(CONFIG.storage.user, JSON.stringify(updatedUser));
            
            return updatedUser;
        } catch (error) {
            console.error('Error updating user account:', error);
            throw error;
        }
    },
    
    /**
     * Get user orders
     * @return {Promise} - Promise resolving to user orders
     */
    getUserOrders: async function() {
        try {
            // In a real implementation, you would use the WooCommerce API
            // For this static demo, we'll use localStorage
            
            // Check if user is logged in
            if (!this.isLoggedIn()) {
                throw new Error('User not logged in');
            }
            
            // Get orders from localStorage
            const orders = JSON.parse(localStorage.getItem('fungushead_orders') || '[]');
            
            return orders;
        } catch (error) {
            console.error('Error getting user orders:', error);
            throw error;
        }
    },
    
    /**
     * Subscribe to newsletter
     * @param {string} email - Email address
     * @return {Promise} - Promise resolving to success status
     */
    subscribeNewsletter: async function(email) {
        try {
            // In a real implementation, you would send this to your newsletter service
            // For this static demo, we'll simulate it
            
            // Store email in localStorage for demo purposes
            const subscribers = JSON.parse(localStorage.getItem('fungushead_subscribers') || '[]');
            
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('fungushead_subscribers', JSON.stringify(subscribers));
            }
            
            return { success: true };
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            throw error;
        }
    }
};

// Export API for use in other scripts
window.API = API; 