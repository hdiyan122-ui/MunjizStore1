/**
 * Products Module
 * Handles product data, filtering, searching, and display
 * Now integrated with Firebase database for real-time sync
 */

// Products data - populated from database at runtime
let productsData = [];

const categories = [
    { id: 'courses', name: 'cat_courses', icon: '🎓', count: 0 },
    { id: 'ebooks', name: 'cat_ebooks', icon: '📚', count: 0 },
    { id: 'ai-tools', name: 'cat_ai_tools', icon: '🤖', count: 0 },
    { id: 'services', name: 'cat_services', icon: '🛠️', count: 0 }
];

const testimonials = [
    {
        text: 'msg_testimonial_1',
        author: 'testimonial_author_1',
        role: 'testimonial_role_1',
        rating: 5
    },
    {
        text: 'msg_testimonial_2',
        author: 'testimonial_author_2',
        role: 'testimonial_role_2',
        rating: 5
    },
    {
        text: 'msg_testimonial_3',
        author: 'testimonial_author_3',
        role: 'testimonial_role_3',
        rating: 5
    }
];

class ProductManager {
    constructor() {
        this.allProducts = productsData;
        this.filteredProducts = [...this.allProducts];
        this.currentFilters = {
            category: '',
            minPrice: 0,
            maxPrice: 1000,
            search: '',
            sortBy: 'newest'
        };
        this.favorites = this.getStoredFavorites();
        this.initializeProductsCount();
    }

    /**
     * Update products from database (called when Firebase data changes)
     * Converts database products to the format needed by the manager
     */
    updateProductsFromDatabase(databaseProducts) {
        // Convert database products to the format expected by ProductManager
        this.allProducts = databaseProducts.map(p => {
            // Map database fields to expected format
            // Handle both admin dashboard format and website format
            const title = p.title || p.name || 'Untitled';
            const description = p.description || p.shortDesc || '';
            
            return {
                id: p.id,
                title: title,
                description: description,
                price: p.price || 0,
                category: p.category || 'services',
                icon: p.icon || '📦',
                image: p.image || null,  // Include Base64 image if available
                featured: p.featured || false,
                popular: p.popular || false,
                created: new Date(p.created || p.createdAt || new Date())
            };
        });

        // Update filtered products and re-render
        this.applyFilters();
        this.initializeProductsCount();
        
        // Re-render the products grid
        if (document.getElementById('productsGrid')) {
            renderProductsGrid('productsGrid');
        }
        
        console.log('Products updated from database:', this.allProducts.length, 'items');
    }

    initializeProductsCount() {
        categories.forEach(cat => {
            cat.count = this.allProducts.filter(p => p.category === cat.id).length;
        });
    }

    getStoredFavorites() {
        const stored = localStorage.getItem('favorites');
        return stored ? JSON.parse(stored) : [];
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    toggleFavorite(productId) {
        const index = this.favorites.indexOf(productId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(productId);
        }
        this.saveFavorites();
        this.updateFavoriteButtons();
    }

    isFavorite(productId) {
        return this.favorites.includes(productId);
    }

    setFilters(filters) {
        this.currentFilters = { ...this.currentFilters, ...filters };
        this.applyFilters();
    }

    applyFilters() {
        this.filteredProducts = this.allProducts.filter(product => {
            // Category filter
            if (this.currentFilters.category && product.category !== this.currentFilters.category) {
                return false;
            }

            // Price filter
            if (product.price < this.currentFilters.minPrice || product.price > this.currentFilters.maxPrice) {
                return false;
            }

            // Search filter - Search in product name/title and description
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase().trim();
                
                // Get product name (from database or i18n key)
                let productName = '';
                if (product.name) {
                    productName = product.name; // Database format
                } else if (product.title) {
                    // Try to get translated title, fallback to key
                    productName = i18n.t ? i18n.t(product.title) : product.title;
                }
                
                // Get product description
                let productDesc = '';
                if (product.description) {
                    productDesc = product.description; // Database format
                }
                
                const nameMatch = productName.toLowerCase().includes(searchTerm);
                const descMatch = productDesc.toLowerCase().includes(searchTerm);
                
                if (!nameMatch && !descMatch) {
                    return false;
                }
            }

            return true;
        });

        this.applySorting();
    }

    applySorting() {
        switch (this.currentFilters.sortBy) {
            case 'newest':
                this.filteredProducts.sort((a, b) => b.created - a.created);
                break;
            case 'popular':
                this.filteredProducts.sort((a, b) => b.popular - a.popular);
                break;
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
        }
    }

    getFilteredProducts() {
        return this.filteredProducts;
    }

    getAllProducts() {
        return this.allProducts;
    }

    getProductById(id) {
        return this.allProducts.find(p => p.id === id);
    }

    getFeaturedProducts() {
        return this.allProducts.filter(p => p.featured);
    }

    resetFilters() {
        this.currentFilters = {
            category: '',
            minPrice: 0,
            maxPrice: 1000,
            search: '',
            sortBy: 'newest'
        };
        this.applyFilters();
    }

    updateFavoriteButtons() {
        document.querySelectorAll('[data-product-id]').forEach(element => {
            const productId = parseInt(element.getAttribute('data-product-id'));
            const isFav = this.isFavorite(productId);
            const favBtn = element.querySelector('.favorite-btn');
            if (favBtn) {
                if (isFav) {
                    favBtn.classList.add('active');
                } else {
                    favBtn.classList.remove('active');
                }
            }
        });
    }
}

// Initialize product manager
const productManager = new ProductManager();

// Render product card
function renderProductCard(product) {
    const isFav = productManager.isFavorite(product.id);
    const card = document.createElement('div');
    card.className = 'product-card fade-in-scroll';
    card.setAttribute('data-product-id', product.id);

    const formattedPrice = currencyManager.format(product.price);

    // Determine image source - use Base64 if available, fallback to icon
    let imageContent = `<span style="font-size: 4rem;">${product.icon}</span>`;
    if (product.image) {
        // Check if it's a Base64 image (starts with data:) or a URL
        imageContent = `<img src="${product.image}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">`;
    }

    card.innerHTML = `
        <div class="product-image">
            ${imageContent}
        </div>
        <div class="product-content">
            <span class="product-category">${i18n.t(product.category === 'courses' ? 'cat_courses' : product.category === 'ebooks' ? 'cat_ebooks' : product.category === 'ai-tools' ? 'cat_ai_tools' : 'cat_services')}</span>
            <h3 class="product-title">${i18n.t(product.title)}</h3>
            <p class="product-description">${i18n.t(product.description)}</p>
            <div class="product-footer">
                <span class="product-price" data-price="${product.price}">${formattedPrice}</span>
                <button class="btn btn-primary product-cta" data-product-id="${product.id}">
                    ${i18n.t('cta_contact')}
                </button>
            </div>
        </div>
    `;

    // Add event listener to contact button
    const contactBtn = card.querySelector('.product-cta');
    contactBtn.addEventListener('click', () => {
        openProductContactModal(product);
    });

    return card;
}

// Render all products grid
function renderProductsGrid(container, products = null) {
    const target = document.getElementById(container);
    if (!target) return;

    const prods = products || productManager.getFilteredProducts();
    target.innerHTML = '';

    if (prods.length === 0) {
        target.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.25rem; opacity: 0.7;">${i18n.t('no_products_found') || 'No products found'}</p>
            </div>
        `;
        return;
    }

    prods.forEach(product => {
        const card = renderProductCard(product);
        target.appendChild(card);
    });

    ScrollAnimations.init();
}

// Render featured carousel
function renderFeaturedCarousel() {
    const carousel = document.getElementById('featuredCarousel');
    if (!carousel) return;

    carousel.innerHTML = '';
    const featured = productManager.getFeaturedProducts();

    featured.forEach(product => {
        const card = renderProductCard(product);
        carousel.appendChild(card);
    });
}

// Render categories
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card fade-in-scroll';
        card.innerHTML = `
            <div class="category-icon">${category.icon}</div>
            <h3 class="category-name">${i18n.t(category.name)}</h3>
            <p class="category-count">${category.count} ${i18n.t('products') || 'products'}</p>
        `;

        card.addEventListener('click', () => {
            productManager.setFilters({ category: category.id });
            renderProductsGrid('productsGrid');
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });

        grid.appendChild(card);
    });

    ScrollAnimations.init();
}

// Render testimonials
function renderTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    // Sample testimonials
    const sampleTestimonials = [
        {
            text: 'Amazing courses! The Django course helped me land a new job. Highly recommended!',
            author: 'Ahmed Hassan',
            role: 'Web Developer',
            rating: 5
        },
        {
            text: 'The WhatsApp bot saved me so much time. The AI integration is incredible.',
            author: 'Fatima Al-Mansouri',
            role: 'Business Owner',
            rating: 5
        },
        {
            text: 'Professional website creation service. They understood my vision perfectly.',
            author: 'Mohamed Youssef',
            role: 'Entrepreneur',
            rating: 5
        }
    ];

    sampleTestimonials.forEach((testimonial, index) => {
        const card = document.createElement('div');
        card.className = 'testimonial-card fade-in-scroll';
        card.innerHTML = `
            <div class="testimonial-stars">${'⭐'.repeat(testimonial.rating)}</div>
            <p class="testimonial-text">"${testimonial.text}"</p>
            <div class="testimonial-author">${testimonial.author}</div>
            <div class="testimonial-role">${testimonial.role}</div>
        `;
        grid.appendChild(card);
    });

    ScrollAnimations.init();
}

// Update price filter display
function updatePriceDisplay() {
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const priceDisplay = document.getElementById('priceDisplay');

    if (minPrice && maxPrice && priceDisplay) {
        const min = parseInt(minPrice.value);
        const max = parseInt(maxPrice.value);
        productManager.setFilters({ minPrice: min, maxPrice: max });
        priceDisplay.textContent = currencyManager.format(min) + ' - ' + currencyManager.format(max);
    }
}

// Setup filters
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortSelect');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const resetBtn = document.getElementById('resetFilters');
    const searchInput = document.getElementById('searchInput');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            productManager.setFilters({ category: e.target.value });
            renderProductsGrid('productsGrid');
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            productManager.setFilters({ sortBy: e.target.value });
            renderProductsGrid('productsGrid');
        });
    }

    if (minPrice) {
        minPrice.addEventListener('input', updatePriceDisplay);
    }

    if (maxPrice) {
        maxPrice.addEventListener('input', updatePriceDisplay);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            productManager.resetFilters();
            categoryFilter.value = '';
            sortSelect.value = 'newest';
            minPrice.value = 0;
            maxPrice.value = 1000;
            updatePriceDisplay();
            renderProductsGrid('productsGrid');
        });
    }

    if (searchInput) {
        const debouncedSearch = debounce((e) => {
            const searchValue = e.target.value.trim();
            
            if (searchValue) {
                // Use search module if available
                if (typeof searchManager !== 'undefined') {
                    searchManager.performSearch(searchValue);
                } else {
                    // Fallback: Use filter in product manager
                    productManager.setFilters({ search: searchValue });
                    renderProductsGrid('productsGrid');
                }
            } else {
                // Clear search
                productManager.resetFilters();
                renderProductsGrid('productsGrid');
                if (typeof searchManager !== 'undefined') {
                    searchManager.hideSearchResults();
                }
            }
        }, 300);

        searchInput.addEventListener('input', debouncedSearch);
    }
}

// Initialize all products on page load
function initializeProducts() {
    renderFeaturedCarousel();
    renderProductsGrid('productsGrid');
    renderCategories();
    renderTestimonials();
    setupFilters();

    // Setup carousel navigation
    setupCarouselNavigation();
}

// Setup carousel navigation
function setupCarouselNavigation() {
    const carousel = document.getElementById('featuredCarousel');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (carousel && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -300, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProducts);
} else {
    initializeProducts();
}
