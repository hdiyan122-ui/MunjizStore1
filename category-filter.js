/**
 * Category Filtering Module
 * Handles navigation dropdown category filtering
 */

document.addEventListener('DOMContentLoaded', function() {
    // Setup category dropdown links
    const categoryLinks = document.querySelectorAll('.dropdown-link');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the category from the link
            const categoryText = this.textContent.toLowerCase().trim();
            
            // Map text to category ID
            let categoryId = '';
            switch(categoryText) {
                case 'courses':
                    categoryId = 'courses';
                    break;
                case 'e-books':
                case 'ebooks':
                    categoryId = 'ebooks';
                    break;
                case 'ai tools':
                    categoryId = 'ai-tools';
                    break;
                case 'services':
                    categoryId = 'services';
                    break;
            }
            
            if (categoryId && typeof productManager !== 'undefined') {
                // Apply the category filter
                productManager.setFilters({ category: categoryId });
                
                // Update the filter select to match
                const categoryFilter = document.getElementById('categoryFilter');
                if (categoryFilter) {
                    categoryFilter.value = categoryId;
                }
                
                // Render the filtered products
                renderProductsGrid('productsGrid');
                
                // Scroll to products section
                const productsSection = document.getElementById('products');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
                
                console.log('Filtered products by category:', categoryId);
            }
        });
    });
    
    // Add visual feedback to dropdown links
    categoryLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = 'var(--accent-color, #FF0000)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = '';
        });
    });
});

/**
 * Add active state to category filter
 */
function updateCategoryDisplay(categoryId) {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = categoryId;
    }
}

/**
 * Reset category filter
 */
function resetCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = '';
    }
}
