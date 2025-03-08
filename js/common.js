/**
 * Fungushead - Common JavaScript
 * This file contains common functionality used across all pages
 */

// Function to include header and footer on all pages
async function includeSharedComponents() {
    // Find header and footer placeholders
    const headerPlaceholder = document.querySelector('#header-placeholder');
    const footerPlaceholder = document.querySelector('#footer-placeholder');

    // Include header if placeholder exists
    if (headerPlaceholder) {
        try {
            const headerResponse = await fetch('./pages/includes/header.html');
            const headerHtml = await headerResponse.text();
            headerPlaceholder.innerHTML = headerHtml;
            initializeHeader(); // Initialize header functionality
        } catch (error) {
            console.error('Error loading header:', error);
            // Fallback: If header can't be loaded, don't hide the existing header
            const existingHeader = headerPlaceholder.innerHTML;
            if (existingHeader && existingHeader.trim() !== '') {
                console.log('Using existing header as fallback');
            }
        }
    }

    // Include footer if placeholder exists (future implementation)
    if (footerPlaceholder) {
        try {
            const footerResponse = await fetch('./pages/includes/footer.html');
            const footerHtml = await footerResponse.text();
            footerPlaceholder.innerHTML = footerHtml;
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }
}

// Function to initialize header functionality
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

// Initialize common components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    includeSharedComponents();
}); 