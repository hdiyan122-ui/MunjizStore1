/**
 * Main Application Module
 * Handles app initialization, routing, and global setup
 */

class MunjizApp {
    constructor() {
        this.initialized = false;
        this.init();
    }

    async init() {
        console.log('🚀 Munjiz App Initializing...');

        // Initialize utilities (currency, theme, etc.)
        await this.waitForUtilities();

        // Setup navigation
        this.setupNavigation();

        // Setup mobile menu
        this.setupMobileMenu();

        // Setup smooth scrolling
        this.setupSmoothScroll();

        // Add scroll animations
        this.setupScrollAnimations();

        // Initialize other features
        this.setupInteractions();

        this.initialized = true;
        console.log('✅ Munjiz App Initialized Successfully!');
    }

    async waitForUtilities() {
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                if (window.currencyManager && window.themeManager && window.i18n && window.productManager) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });
    }

    setupNavigation() {
        const navbar = document.getElementById('navbar');
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 100) {
                navbar.style.boxShadow = '0 4px 12px rgba(255, 0, 0, 0.15)';
            } else {
                navbar.style.boxShadow = 'none';
            }

            lastScrollTop = scrollTop;
        });

        // Smooth scroll to sections
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu on link click
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Close menu on window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    setupSmoothScroll() {
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        // Apply animation class to elements
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    setupInteractions() {
        // Parallax effect on hero section
        this.setupParallax();

        // Update prices when currency changes
        this.setupCurrencyUpdateListener();

        // Handle keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Performance monitoring
        this.monitorPerformance();
    }

    setupParallax() {
        const hero = document.querySelector('.hero');
        const floatingElements = document.querySelectorAll('.floating-element');

        if (hero && floatingElements.length > 0) {
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset;
                const heroRect = hero.getBoundingClientRect();

                if (heroRect.top + heroRect.height > 0) {
                    floatingElements.forEach((el, index) => {
                        const speed = 0.5 - (index * 0.1);
                        el.style.transform = `translateY(${scrollTop * speed}px)`;
                    });
                }
            });
        }
    }

    setupCurrencyUpdateListener() {
        const originalSetCurrency = currencyManager.setCurrency.bind(currencyManager);
        currencyManager.setCurrency = function(currency) {
            originalSetCurrency(currency);
            // Re-render products to update prices
            if (window.renderProductsGrid && window.productManager) {
                renderProductsGrid('productsGrid');
                renderFeaturedCarousel();
            }
        };
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + / to search
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Escape to close modals
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal.active');
                modals.forEach(modal => {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
        });
    }

    monitorPerformance() {
        if ('PerformanceObserver' in window) {
            // Log Core Web Vitals
            console.log('📊 Performance monitoring active');
        }
    }
}

// Application Statistics & Analytics (Client-side tracking)
class Analytics {
    constructor() {
        this.pageViews = this.getStoredAnalytics().pageViews || 0;
        this.contactClicks = this.getStoredAnalytics().contactClicks || 0;
        this.productViews = this.getStoredAnalytics().productViews || 0;
        
        this.trackPageView();
        this.setupTracking();
    }

    getStoredAnalytics() {
        const stored = localStorage.getItem('analytics');
        return stored ? JSON.parse(stored) : {};
    }

    saveAnalytics() {
        localStorage.setItem('analytics', JSON.stringify({
            pageViews: this.pageViews,
            contactClicks: this.contactClicks,
            productViews: this.productViews
        }));
    }

    trackPageView() {
        this.pageViews++;
        this.saveAnalytics();
    }

    trackContactClick() {
        this.contactClicks++;
        this.saveAnalytics();
    }

    trackProductView(productId) {
        this.productViews++;
        this.saveAnalytics();
    }

    setupTracking() {
        // Track contact button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[id$="ContactBtn"]') || e.target.matches('.btn-primary[id$="ContactBtn"]')) {
                this.trackContactClick();
            }
        });

        // Track product views
        document.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productId = productCard.getAttribute('data-product-id');
                this.trackProductView(productId);
            }
        });
    }

    getStats() {
        return {
            pageViews: this.pageViews,
            contactClicks: this.contactClicks,
            productViews: this.productViews
        };
    }
}

// Global instances
let app = null;
let analytics = null;

// Initialize app when all resources are loaded
function initializeApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            app = new MunjizApp();
            analytics = new Analytics();
        });
    } else {
        app = new MunjizApp();
        analytics = new Analytics();
    }
}

// Start initialization
initializeApp();

// Export for external use
window.munjizApp = app;
window.analytics = analytics;

// Add helpful debugging
window.getMunjizStats = () => {
    if (analytics) {
        return {
            ...analytics.getStats(),
            currency: currencyManager.getCurrentCurrency(),
            language: i18n.currentLanguage,
            theme: themeManager.isDarkMode ? 'dark' : 'light',
            products: productManager.getAllProducts().length,
            favorites: productManager.favorites.length
        };
    }
};

console.log('💎 Munjiz - Power Your Digital Future');
console.log('📊 Run window.getMunjizStats() to see app statistics');

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    // You can add service worker registration here for offline support
    // navigator.serviceWorker.register('sw.js').catch(() => {});
}

// Request permissions for notifications (optional)
if ('Notification' in window && Notification.permission === 'default') {
    // Optionally request notification permission
    // Notification.requestPermission();
}
