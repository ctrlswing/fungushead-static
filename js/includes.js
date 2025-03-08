// Function to load HTML includes
function loadIncludes() {
    // Determine if we're on the root page or in a subdirectory
    const isRootPage = window.location.pathname.endsWith('index.html') || 
                      window.location.pathname.endsWith('/') ||
                      window.location.pathname === '';

    // Load header
    loadInclude('header-include', isRootPage ? './pages/includes/header.html' : './includes/header.html');
    
    // Load footer
    loadInclude('footer-include', isRootPage ? './pages/includes/footer.html' : './includes/footer.html');
}

// Function to fetch and insert include content
function loadInclude(elementId, url) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load include: ${url}`);
            }
            return response.text();
        })
        .then(html => {
            element.innerHTML = html;
            
            // Fix paths based on whether we're on the root page or in a subdirectory
            const isRootPage = window.location.pathname.endsWith('index.html') || 
                              window.location.pathname.endsWith('/') ||
                              window.location.pathname === '';
            
            // Set correct paths for all data attributes
            element.querySelectorAll('[data-src-root], [data-src-pages]').forEach(img => {
                const srcAttr = isRootPage ? 'data-src-root' : 'data-src-pages';
                img.src = img.getAttribute(srcAttr);
            });
            
            // Set correct link URLs
            if (isRootPage) {
                // Root page link setup
                element.querySelector('.home-link')?.setAttribute('href', './index.html');
                element.querySelector('.new-strains-link')?.setAttribute('href', './pages/new-strains.html');
                element.querySelector('.spore-syringes-link')?.setAttribute('href', './pages/spore-syringes.html');
                element.querySelector('.liquid-culture-link')?.setAttribute('href', './pages/liquid-culture.html');
                element.querySelector('.best-sellers-link')?.setAttribute('href', './pages/best-sellers.html');
                element.querySelector('.mixpacks-link')?.setAttribute('href', './pages/mixpacks.html');
                element.querySelector('.support-link')?.setAttribute('href', './pages/support.html');
                element.querySelector('.blog-link')?.setAttribute('href', './pages/blog.html');
                element.querySelector('.search-button')?.setAttribute('href', './pages/search.html');
                element.querySelector('.account-button')?.setAttribute('href', './pages/account.html');
                element.querySelector('.cart-button')?.setAttribute('href', './pages/cart.html');
            } else {
                // Subdirectory page link setup
                element.querySelector('.home-link')?.setAttribute('href', '../index.html');
                element.querySelector('.new-strains-link')?.setAttribute('href', './new-strains.html');
                element.querySelector('.spore-syringes-link')?.setAttribute('href', './spore-syringes.html');
                element.querySelector('.liquid-culture-link')?.setAttribute('href', './liquid-culture.html');
                element.querySelector('.best-sellers-link')?.setAttribute('href', './best-sellers.html');
                element.querySelector('.mixpacks-link')?.setAttribute('href', './mixpacks.html');
                element.querySelector('.support-link')?.setAttribute('href', './support.html');
                element.querySelector('.blog-link')?.setAttribute('href', './blog.html');
                element.querySelector('.search-button')?.setAttribute('href', './search.html');
                element.querySelector('.account-button')?.setAttribute('href', './account.html');
                element.querySelector('.cart-button')?.setAttribute('href', './cart.html');
            }
        })
        .catch(error => {
            console.error('Error loading include:', error);
        });
}

// Run when DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadIncludes); 