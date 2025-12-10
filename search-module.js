/**
 * Search Module for Munjiz Website
 * Handles all search functionality including:
 * - Real-time search as user types
 * - Case-insensitive searching
 * - Search across product names and descriptions
 * - Integration with database products
 * - Responsive display of search results
 */

class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchResultsContainer = null;
        this.isSearchActive = false;
        this.searchDebounceTimer = null;
        this.init();
    }

    init() {
        if (!this.searchInput) {
            console.warn('Search input element not found');
            return;
        }

        this.setupSearchContainer();
        this.setupEventListeners();
        console.log('✓ Search Manager initialized');
    }

    /**
     * Create and setup search results container
     */
    setupSearchContainer() {
        // Check if container already exists
        let container = document.getElementById('searchResults');
        if (!container) {
            container = document.createElement('div');
            container.id = 'searchResults';
            container.className = 'search-results-container hidden';
            this.searchInput.parentElement.appendChild(container);
        }
        this.searchResultsContainer = container;
    }

    /**
     * Setup event listeners for search input
     */
    setupEventListeners() {
        // Input event for real-time search
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Clear search on focus if empty
        this.searchInput.addEventListener('focus', () => {
            if (!this.searchInput.value) {
                this.showAllProducts();
            }
        });

        // Clear search on blur
        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                if (!this.searchInput.value) {
                    this.hideSearchResults();
                }
            }, 200);
        });

        // Clear search on Escape key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
    }

    /**
     * Main search handler with debounce
     */
    handleSearch(query) {
        // Clear previous timer
        if (this.searchDebounceTimer) {
            clearTimeout(this.searchDebounceTimer);
        }

        // If search is empty, show all products
        if (!query || query.trim() === '') {
            this.showAllProducts();
            return;
        }

        // Debounce search - wait 300ms before executing
        this.searchDebounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }

    /**
     * Perform the actual search
     */
    performSearch(query) {
        const results = this.getSearchResults(query);
        
        if (results.length === 0) {
            this.showNoResults(query);
        } else {
            this.displaySearchResults(results);
        }
    }

    /**
     * Get search results from database
     * Searches in: name, description, category
     */
    getSearchResults(query) {
        if (!query || typeof query !== 'string') {
            return [];
        }

        const lowerQuery = query.toLowerCase().trim();

        // Get all products from ProductManager
        if (typeof productManager === 'undefined') {
            console.warn('ProductManager not available');
            return [];
        }

        const allProducts = productManager.getAllProducts();

        // Filter products by search term
        const results = allProducts.filter(product => {
            // Convert all searchable fields to lowercase for comparison
            const productName = (product.title || product.name || '').toLowerCase();
            const productDesc = (product.description || '').toLowerCase();
            const productCategory = (product.category || '').toLowerCase();

            // Search in name
            if (productName.includes(lowerQuery)) {
                return true;
            }

            // Search in description
            if (productDesc.includes(lowerQuery)) {
                return true;
            }

            // Search in category
            if (productCategory.includes(lowerQuery)) {
                return true;
            }

            return false;
        });

        return results;
    }

    /**
     * Display search results
     */
    displaySearchResults(results) {
        if (!this.searchResultsContainer) return;

        this.isSearchActive = true;
        this.searchResultsContainer.innerHTML = '';
        this.searchResultsContainer.classList.remove('hidden');

        // Add results header
        const header = document.createElement('div');
        header.className = 'search-results-header';
        header.innerHTML = `
            <span class="search-result-count">${results.length} ${results.length === 1 ? 'result' : 'results'} found</span>
            <button class="search-clear-btn" title="Clear search">×</button>
        `;
        
        const clearBtn = header.querySelector('.search-clear-btn');
        clearBtn.addEventListener('click', () => this.clearSearch());
        
        this.searchResultsContainer.appendChild(header);

        // Add product results
        const resultsGrid = document.createElement('div');
        resultsGrid.className = 'search-results-grid';

        results.forEach(product => {
            const resultItem = this.createResultItem(product);
            resultsGrid.appendChild(resultItem);
        });

        this.searchResultsContainer.appendChild(resultsGrid);

        // Highlight search results in main grid
        this.highlightMainGridResults(results);
    }

    /**
     * Create a single search result item
     */
    createResultItem(product) {
        const item = document.createElement('div');
        item.className = 'search-result-item';

        const title = product.title || product.name;
        const description = product.description || '';
        const price = product.price || 0;
        const category = product.category || 'unknown';

        // Format price
        let formattedPrice = '$' + price.toFixed(2);
        if (typeof currencyManager !== 'undefined') {
            formattedPrice = currencyManager.format(price);
        }

        // Get category label
        const categoryLabels = {
            'courses': 'Courses',
            'ebooks': 'E-books',
            'ai-tools': 'AI Tools',
            'services': 'Services'
        };
        const categoryLabel = categoryLabels[category] || category;

        item.innerHTML = `
            <div class="search-result-content">
                <div class="search-result-title">${title}</div>
                <div class="search-result-category">${categoryLabel}</div>
                <div class="search-result-description">${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</div>
                <div class="search-result-price">${formattedPrice}</div>
            </div>
            <button class="search-result-action" data-product-id="${product.id}">View</button>
        `;

        // Add click handler to view product
        const viewBtn = item.querySelector('.search-result-action');
        viewBtn.addEventListener('click', () => {
            this.viewProduct(product);
        });

        return item;
    }

    /**
     * View product details (scroll to main grid)
     */
    viewProduct(product) {
        // Clear search
        this.clearSearch();

        // Scroll to products section
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Highlight the product in the grid
        setTimeout(() => {
            const productElement = document.querySelector(`[data-product-id="${product.id}"]`);
            if (productElement) {
                productElement.classList.add('search-highlight');
                productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Remove highlight after 2 seconds
                setTimeout(() => {
                    productElement.classList.remove('search-highlight');
                }, 2000);
            }
        }, 500);
    }

    /**
     * Highlight matching products in main grid
     */
    highlightMainGridResults(results) {
        // Remove all previous highlights
        document.querySelectorAll('.product-card.search-match').forEach(el => {
            el.classList.remove('search-match');
        });

        // Add highlights to matching products
        results.forEach(product => {
            const productElement = document.querySelector(`[data-product-id="${product.id}"]`);
            if (productElement) {
                productElement.classList.add('search-match');
            }
        });
    }

    /**
     * Show all products (clear search)
     */
    showAllProducts() {
        if (typeof productManager !== 'undefined') {
            productManager.resetFilters();
            renderProductsGrid('productsGrid');
        }
        this.hideSearchResults();
    }

    /**
     * Show "no results" message
     */
    showNoResults(query) {
        if (!this.searchResultsContainer) return;

        this.isSearchActive = true;
        this.searchResultsContainer.innerHTML = '';
        this.searchResultsContainer.classList.remove('hidden');

        const noResults = document.createElement('div');
        noResults.className = 'search-no-results';
        noResults.innerHTML = `
            <div class="no-results-icon">🔍</div>
            <p class="no-results-text">No products found for "<strong>${this.escapeHtml(query)}</strong>"</p>
            <p class="no-results-hint">Try searching for a different term or browse categories</p>
            <button class="btn btn-secondary" id="browseAllBtn">Browse All Products</button>
        `;

        const browseBtn = noResults.querySelector('#browseAllBtn');
        browseBtn.addEventListener('click', () => this.clearSearch());

        this.searchResultsContainer.appendChild(noResults);
    }

    /**
     * Hide search results
     */
    hideSearchResults() {
        if (this.searchResultsContainer) {
            this.searchResultsContainer.classList.add('hidden');
            this.isSearchActive = false;
        }
    }

    /**
     * Clear search completely
     */
    clearSearch() {
        this.searchInput.value = '';
        this.hideSearchResults();
        this.showAllProducts();
        this.searchInput.focus();
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize search manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.searchManager = new SearchManager();
        }, 500); // Wait for product manager to initialize
    });
} else {
    setTimeout(() => {
        window.searchManager = new SearchManager();
    }, 500);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchManager };
}
