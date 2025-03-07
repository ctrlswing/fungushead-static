/**
 * Fungushead - Cart Functionality
 * This file contains functions for managing the shopping cart
 */

// Cart Controller Object
const Cart = {
    /**
     * Initialize cart functionality
     */
    init: function() {
        // Initialize cart UI elements
        this.initCartUI();
        
        // Update cart count
        this.updateCartCount();
        
        // Add event listeners
        this.addEventListeners();
    },
    
    /**
     * Initialize cart UI elements
     */
    initCartUI: function() {
        // Get cart elements
        this.cartSidebar = document.getElementById('cart-sidebar');
        this.cartItems = document.getElementById('cart-items');
        this.cartTotalAmount = document.getElementById('cart-total-amount');
        this.cartCountElements = document.querySelectorAll('.cart-count');
        
        // Get cart buttons
        this.openCartButtons = document.querySelectorAll('.cart-link');
        this.closeCartButton = document.getElementById('close-cart');
    },
    
    /**
     * Add event listeners for cart functionality
     */
    addEventListeners: function() {
        // Add click event listeners to open cart buttons
        if (this.openCartButtons) {
            this.openCartButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openCart();
                });
            });
        }
        
        // Add click event listener to close cart button
        if (this.closeCartButton) {
            this.closeCartButton.addEventListener('click', () => {
                this.closeCart();
            });
        }
        
        // Add click event listener to document for closing cart when clicking outside
        document.addEventListener('click', (e) => {
            if (this.cartSidebar && this.cartSidebar.classList.contains('open')) {
                // Check if click is outside cart sidebar
                if (!this.cartSidebar.contains(e.target) && !e.target.closest('.cart-link')) {
                    this.closeCart();
                }
            }
        });
        
        // Add event listener for add to cart buttons
        document.addEventListener('click', (e) => {
            const addToCartButton = e.target.closest('.add-to-cart-btn');
            if (addToCartButton) {
                e.preventDefault();
                
                // Get product ID and quantity
                const productId = parseInt(addToCartButton.dataset.productId);
                const quantityInput = document.getElementById(`quantity-${productId}`);
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                
                // Add to cart
                if (productId) {
                    this.addToCart(productId, quantity);
                }
            }
        });
    },
    
    /**
     * Open cart sidebar
     */
    openCart: function() {
        if (this.cartSidebar) {
            // Add open class to cart sidebar
            this.cartSidebar.classList.add('open');
            
            // Load cart items
            this.loadCartItems();
            
            // Add body class to prevent scrolling
            document.body.classList.add('cart-open');
        }
    },
    
    /**
     * Close cart sidebar
     */
    closeCart: function() {
        if (this.cartSidebar) {
            // Remove open class from cart sidebar
            this.cartSidebar.classList.remove('open');
            
            // Remove body class to allow scrolling
            document.body.classList.remove('cart-open');
        }
    },
    
    /**
     * Load cart items into cart sidebar
     */
    loadCartItems: async function() {
        try {
            // Get cart data
            const cart = await API.getCart();
            
            // Clear cart items container
            if (this.cartItems) {
                this.cartItems.innerHTML = '';
            }
            
            // Check if cart is empty
            if (cart.items.length === 0) {
                // Display empty cart message
                if (this.cartItems) {
                    this.cartItems.innerHTML = `
                        <div class="empty-cart">
                            <p>Your cart is empty</p>
                            <a href="pages/shop.html" class="btn btn-primary">Shop Now</a>
                        </div>
                    `;
                }
            } else {
                // Display cart items
                cart.items.forEach((item, index) => {
                    if (this.cartItems) {
                        const cartItemElement = document.createElement('div');
                        cartItemElement.className = 'cart-item';
                        cartItemElement.innerHTML = `
                            <div class="cart-item-image">
                                <img src="${item.product_image}" alt="${item.product_name}">
                            </div>
                            <div class="cart-item-details">
                                <h4 class="cart-item-title">${item.product_name}</h4>
                                <div class="cart-item-price">${formatPrice(item.price)} × ${item.quantity}</div>
                                <div class="cart-item-quantity">
                                    <button class="quantity-btn minus" data-index="${index}">-</button>
                                    <input type="number" value="${item.quantity}" min="1" max="99" data-index="${index}">
                                    <button class="quantity-btn plus" data-index="${index}">+</button>
                                </div>
                            </div>
                            <button class="cart-item-remove" data-index="${index}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        `;
                        
                        // Add to cart items container
                        this.cartItems.appendChild(cartItemElement);
                        
                        // Add event listeners for quantity buttons
                        const minusButton = cartItemElement.querySelector('.quantity-btn.minus');
                        const plusButton = cartItemElement.querySelector('.quantity-btn.plus');
                        const quantityInput = cartItemElement.querySelector('input[type="number"]');
                        const removeButton = cartItemElement.querySelector('.cart-item-remove');
                        
                        // Minus button
                        if (minusButton) {
                            minusButton.addEventListener('click', () => {
                                const newQuantity = Math.max(1, item.quantity - 1);
                                this.updateCartItemQuantity(index, newQuantity);
                            });
                        }
                        
                        // Plus button
                        if (plusButton) {
                            plusButton.addEventListener('click', () => {
                                const newQuantity = item.quantity + 1;
                                this.updateCartItemQuantity(index, newQuantity);
                            });
                        }
                        
                        // Quantity input
                        if (quantityInput) {
                            quantityInput.addEventListener('change', () => {
                                const newQuantity = parseInt(quantityInput.value);
                                if (newQuantity > 0) {
                                    this.updateCartItemQuantity(index, newQuantity);
                                } else {
                                    quantityInput.value = item.quantity;
                                }
                            });
                        }
                        
                        // Remove button
                        if (removeButton) {
                            removeButton.addEventListener('click', () => {
                                this.removeCartItem(index);
                            });
                        }
                    }
                });
            }
            
            // Update cart total
            if (this.cartTotalAmount) {
                this.cartTotalAmount.textContent = formatPrice(cart.totals.total);
            }
            
            // Update cart count
            this.updateCartCount();
        } catch (error) {
            console.error('Error loading cart items:', error);
            
            // Display error message
            if (this.cartItems) {
                this.cartItems.innerHTML = `
                    <div class="cart-error">
                        <p>Error loading cart items. Please try again.</p>
                    </div>
                `;
            }
        }
    },
    
    /**
     * Add product to cart
     * @param {number} productId - Product ID
     * @param {number} quantity - Quantity to add
     * @param {Object} variation - Variation data (if applicable)
     */
    addToCart: async function(productId, quantity = 1, variation = null) {
        try {
            // Add to cart via API
            await API.addToCart(productId, quantity, variation);
            
            // Show success notification
            showNotification('Product added to cart', 'success');
            
            // Update cart count
            this.updateCartCount();
            
            // Reload cart items if cart is open
            if (this.cartSidebar && this.cartSidebar.classList.contains('open')) {
                this.loadCartItems();
            } else {
                // Open cart after adding item
                this.openCart();
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            
            // Show error notification
            showNotification('Error adding product to cart', 'error');
        }
    },
    
    /**
     * Update cart item quantity
     * @param {number} itemIndex - Index of the item in the cart
     * @param {number} quantity - New quantity
     */
    updateCartItemQuantity: async function(itemIndex, quantity) {
        try {
            // Update cart item via API
            await API.updateCartItem(itemIndex, quantity);
            
            // Reload cart items
            this.loadCartItems();
        } catch (error) {
            console.error('Error updating cart item:', error);
            
            // Show error notification
            showNotification('Error updating cart item', 'error');
        }
    },
    
    /**
     * Remove item from cart
     * @param {number} itemIndex - Index of the item in the cart
     */
    removeCartItem: async function(itemIndex) {
        try {
            // Remove cart item via API
            await API.removeCartItem(itemIndex);
            
            // Show success notification
            showNotification('Item removed from cart', 'success');
            
            // Reload cart items
            this.loadCartItems();
        } catch (error) {
            console.error('Error removing cart item:', error);
            
            // Show error notification
            showNotification('Error removing item from cart', 'error');
        }
    },
    
    /**
     * Update cart count in UI
     */
    updateCartCount: async function() {
        try {
            // Get cart data
            const cart = await API.getCart();
            
            // Calculate total quantity
            const totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
            
            // Update cart count elements
            if (this.cartCountElements) {
                this.cartCountElements.forEach(element => {
                    element.textContent = totalQuantity;
                    
                    // Add/remove empty class
                    if (totalQuantity === 0) {
                        element.classList.add('empty');
                    } else {
                        element.classList.remove('empty');
                    }
                });
            }
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }
};

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
}); 