/**
 * Fungushead - Checkout Page Functionality
 * This file contains functions specific to the checkout page
 */

// Checkout Page Controller
const CheckoutPage = {
    /**
     * Initialize checkout page functionality
     */
    init: function() {
        // Load order items
        this.loadOrderItems();
        
        // Initialize shipping address toggle
        this.initShippingAddressToggle();
        
        // Initialize checkout form
        this.initCheckoutForm();
        
        // Initialize country/state selectors
        this.initCountryStateSelectors();
    },
    
    /**
     * Load order items from cart
     */
    loadOrderItems: async function() {
        try {
            // Get container element
            const container = document.getElementById('order-items');
            
            if (!container) return;
            
            // Show loading indicator
            container.innerHTML = '<div class="loading">Loading order items...</div>';
            
            // Get cart data
            const cart = await API.getCart();
            
            // Check if cart is empty
            if (cart.items.length === 0) {
                // Redirect to cart page if cart is empty
                window.location.href = 'cart.html';
                return;
            }
            
            // Clear container
            container.innerHTML = '';
            
            // Render order items
            cart.items.forEach(item => {
                const orderItem = document.createElement('div');
                orderItem.className = 'order-item';
                orderItem.innerHTML = `
                    <div class="order-item-name">${item.product_name} × ${item.quantity}</div>
                    <div class="order-item-total">${formatPrice(item.price * item.quantity)}</div>
                `;
                
                container.appendChild(orderItem);
            });
            
            // Update order totals
            this.updateOrderTotals(cart);
        } catch (error) {
            console.error('Error loading order items:', error);
            
            // Get container element
            const container = document.getElementById('order-items');
            
            if (container) {
                container.innerHTML = '<p class="error">Error loading order items. Please try again later.</p>';
            }
        }
    },
    
    /**
     * Update order totals
     * @param {Object} cart - Cart data
     */
    updateOrderTotals: function(cart) {
        // Update subtotal
        const subtotalElement = document.getElementById('order-subtotal');
        if (subtotalElement) {
            subtotalElement.textContent = formatPrice(cart.totals.subtotal);
        }
        
        // Update shipping
        const shippingElement = document.getElementById('order-shipping');
        if (shippingElement) {
            shippingElement.textContent = formatPrice(cart.totals.shipping);
        }
        
        // Update total
        const totalElement = document.getElementById('order-total');
        if (totalElement) {
            totalElement.textContent = formatPrice(cart.totals.total);
        }
    },
    
    /**
     * Initialize shipping address toggle
     */
    initShippingAddressToggle: function() {
        // Get shipping address toggle checkbox
        const shipToDifferentAddressCheckbox = document.getElementById('ship-to-different-address');
        
        if (!shipToDifferentAddressCheckbox) return;
        
        // Get shipping address fields container
        const shippingAddressFields = document.getElementById('shipping-address-fields');
        
        if (!shippingAddressFields) return;
        
        // Add change event listener
        shipToDifferentAddressCheckbox.addEventListener('change', () => {
            // Toggle shipping address fields visibility
            if (shipToDifferentAddressCheckbox.checked) {
                shippingAddressFields.style.display = 'block';
                
                // Make shipping fields required
                const shippingInputs = shippingAddressFields.querySelectorAll('input, select');
                shippingInputs.forEach(input => {
                    if (input.name !== 'shipping_company' && input.name !== 'shipping_address_2') {
                        input.required = true;
                    }
                });
            } else {
                shippingAddressFields.style.display = 'none';
                
                // Make shipping fields not required
                const shippingInputs = shippingAddressFields.querySelectorAll('input, select');
                shippingInputs.forEach(input => {
                    input.required = false;
                });
            }
        });
    },
    
    /**
     * Initialize checkout form
     */
    initCheckoutForm: function() {
        // Get place order button
        const placeOrderButton = document.getElementById('place-order');
        
        if (!placeOrderButton) return;
        
        // Add click event listener
        placeOrderButton.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Validate form
            if (!this.validateCheckoutForm()) {
                return;
            }
            
            // Disable button to prevent multiple submissions
            placeOrderButton.disabled = true;
            placeOrderButton.textContent = 'Processing...';
            
            try {
                // Get form data
                const formData = this.getCheckoutFormData();
                
                // Create order
                const order = await API.createOrder(formData);
                
                // Redirect to Paymonix payment gateway
                if (formData.payment_method === 'paymonix') {
                    const paymonixUrl = API.getPaymonixRedirectUrl(order.id);
                    
                    // In a real implementation, this would redirect to the actual Paymonix payment page
                    // For this demo, we'll simulate it with a confirmation page
                    window.location.href = `order-confirmation.html?order_id=${order.id}&payment_method=paymonix`;
                } else {
                    // Redirect to order confirmation page
                    window.location.href = `order-confirmation.html?order_id=${order.id}`;
                }
            } catch (error) {
                console.error('Error creating order:', error);
                
                // Show error notification
                showNotification('Error creating order. Please try again later.', 'error');
                
                // Re-enable button
                placeOrderButton.disabled = false;
                placeOrderButton.textContent = 'Place Order';
            }
        });
    },
    
    /**
     * Validate checkout form
     * @return {boolean} - Whether form is valid
     */
    validateCheckoutForm: function() {
        // Get checkout form
        const checkoutForm = document.getElementById('checkout-form');
        
        if (!checkoutForm) return false;
        
        // Check form validity
        if (!checkoutForm.checkValidity()) {
            // Trigger form validation
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            checkoutForm.appendChild(submitButton);
            submitButton.click();
            checkoutForm.removeChild(submitButton);
            
            // Show error notification
            showNotification('Please fill in all required fields.', 'error');
            
            return false;
        }
        
        // Check terms agreement
        const termsAgreement = document.getElementById('terms-agreement');
        if (termsAgreement && !termsAgreement.checked) {
            // Show error notification
            showNotification('Please agree to the terms and conditions.', 'error');
            
            // Focus terms agreement checkbox
            termsAgreement.focus();
            
            return false;
        }
        
        return true;
    },
    
    /**
     * Get checkout form data
     * @return {Object} - Form data
     */
    getCheckoutFormData: function() {
        // Get form elements
        const billingFirstName = document.getElementById('billing-first-name').value;
        const billingLastName = document.getElementById('billing-last-name').value;
        const billingCompany = document.getElementById('billing-company').value;
        const billingCountry = document.getElementById('billing-country').value;
        const billingAddress1 = document.getElementById('billing-address-1').value;
        const billingAddress2 = document.getElementById('billing-address-2').value;
        const billingCity = document.getElementById('billing-city').value;
        const billingState = document.getElementById('billing-state').value;
        const billingPostcode = document.getElementById('billing-postcode').value;
        const billingPhone = document.getElementById('billing-phone').value;
        const billingEmail = document.getElementById('billing-email').value;
        
        // Get shipping address toggle
        const shipToDifferentAddress = document.getElementById('ship-to-different-address').checked;
        
        // Initialize form data
        const formData = {
            payment_method: 'paymonix', // Currently only Paymonix is supported
            billing: {
                first_name: billingFirstName,
                last_name: billingLastName,
                company: billingCompany,
                country: billingCountry,
                address_1: billingAddress1,
                address_2: billingAddress2,
                city: billingCity,
                state: billingState,
                postcode: billingPostcode,
                phone: billingPhone,
                email: billingEmail
            },
            shipping: {
                first_name: billingFirstName,
                last_name: billingLastName,
                company: billingCompany,
                country: billingCountry,
                address_1: billingAddress1,
                address_2: billingAddress2,
                city: billingCity,
                state: billingState,
                postcode: billingPostcode
            },
            customer_note: document.getElementById('order-notes').value
        };
        
        // If shipping to different address, get shipping details
        if (shipToDifferentAddress) {
            formData.shipping = {
                first_name: document.getElementById('shipping-first-name').value,
                last_name: document.getElementById('shipping-last-name').value,
                company: document.getElementById('shipping-company').value,
                country: document.getElementById('shipping-country').value,
                address_1: document.getElementById('shipping-address-1').value,
                address_2: document.getElementById('shipping-address-2').value,
                city: document.getElementById('shipping-city').value,
                state: document.getElementById('shipping-state').value,
                postcode: document.getElementById('shipping-postcode').value
            };
        }
        
        return formData;
    },
    
    /**
     * Initialize country/state selectors
     */
    initCountryStateSelectors: function() {
        // Country/state data
        const countries = {
            US: {
                name: 'United States',
                states: {
                    AL: 'Alabama',
                    AK: 'Alaska',
                    AZ: 'Arizona',
                    AR: 'Arkansas',
                    CA: 'California',
                    CO: 'Colorado',
                    CT: 'Connecticut',
                    DE: 'Delaware',
                    FL: 'Florida',
                    GA: 'Georgia',
                    HI: 'Hawaii',
                    ID: 'Idaho',
                    IL: 'Illinois',
                    IN: 'Indiana',
                    IA: 'Iowa',
                    KS: 'Kansas',
                    KY: 'Kentucky',
                    LA: 'Louisiana',
                    ME: 'Maine',
                    MD: 'Maryland',
                    MA: 'Massachusetts',
                    MI: 'Michigan',
                    MN: 'Minnesota',
                    MS: 'Mississippi',
                    MO: 'Missouri',
                    MT: 'Montana',
                    NE: 'Nebraska',
                    NV: 'Nevada',
                    NH: 'New Hampshire',
                    NJ: 'New Jersey',
                    NM: 'New Mexico',
                    NY: 'New York',
                    NC: 'North Carolina',
                    ND: 'North Dakota',
                    OH: 'Ohio',
                    OK: 'Oklahoma',
                    OR: 'Oregon',
                    PA: 'Pennsylvania',
                    RI: 'Rhode Island',
                    SC: 'South Carolina',
                    SD: 'South Dakota',
                    TN: 'Tennessee',
                    TX: 'Texas',
                    UT: 'Utah',
                    VT: 'Vermont',
                    VA: 'Virginia',
                    WA: 'Washington',
                    WV: 'West Virginia',
                    WI: 'Wisconsin',
                    WY: 'Wyoming',
                    DC: 'District of Columbia'
                }
            },
            CA: {
                name: 'Canada',
                states: {
                    AB: 'Alberta',
                    BC: 'British Columbia',
                    MB: 'Manitoba',
                    NB: 'New Brunswick',
                    NL: 'Newfoundland and Labrador',
                    NS: 'Nova Scotia',
                    NT: 'Northwest Territories',
                    NU: 'Nunavut',
                    ON: 'Ontario',
                    PE: 'Prince Edward Island',
                    QC: 'Quebec',
                    SK: 'Saskatchewan',
                    YT: 'Yukon'
                }
            },
            GB: {
                name: 'United Kingdom',
                states: {}
            }
        };
        
        // Initialize billing country/state selectors
        this.initCountryStateSelector('billing-country', 'billing-state', countries);
        
        // Initialize shipping country/state selectors
        this.initCountryStateSelector('shipping-country', 'shipping-state', countries);
    },
    
    /**
     * Initialize country/state selector
     * @param {string} countrySelectId - Country select element ID
     * @param {string} stateSelectId - State select element ID
     * @param {Object} countries - Countries data
     */
    initCountryStateSelector: function(countrySelectId, stateSelectId, countries) {
        // Get country select element
        const countrySelect = document.getElementById(countrySelectId);
        
        if (!countrySelect) return;
        
        // Get state select element
        const stateSelect = document.getElementById(stateSelectId);
        
        if (!stateSelect) return;
        
        // Populate country select
        for (const countryCode in countries) {
            const option = document.createElement('option');
            option.value = countryCode;
            option.textContent = countries[countryCode].name;
            countrySelect.appendChild(option);
        }
        
        // Add change event listener to country select
        countrySelect.addEventListener('change', () => {
            // Get selected country
            const selectedCountry = countrySelect.value;
            
            // Clear state select
            stateSelect.innerHTML = '<option value="">Select a state</option>';
            
            // If country has states, populate state select
            if (selectedCountry && countries[selectedCountry] && countries[selectedCountry].states) {
                const states = countries[selectedCountry].states;
                
                // If country has states, show state select
                if (Object.keys(states).length > 0) {
                    stateSelect.parentElement.style.display = 'block';
                    
                    // Populate state select
                    for (const stateCode in states) {
                        const option = document.createElement('option');
                        option.value = stateCode;
                        option.textContent = states[stateCode];
                        stateSelect.appendChild(option);
                    }
                } else {
                    // If country has no states, hide state select
                    stateSelect.parentElement.style.display = 'none';
                }
            } else {
                // If no country selected, hide state select
                stateSelect.parentElement.style.display = 'none';
            }
        });
        
        // Trigger change event to initialize state select
        countrySelect.dispatchEvent(new Event('change'));
    }
};

// Initialize checkout page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    CheckoutPage.init();
}); 