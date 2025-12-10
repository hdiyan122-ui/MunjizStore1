/**
 * Utility Functions Module
 * Handles currency conversion, formatting, and helper functions
 */

const currencyRates = {
    USD: 1,
    EUR: 0.92,
    MAD: 9.85
};

const currencySymbols = {
    USD: '$',
    EUR: '€',
    MAD: 'د.م.'
};

class CurrencyManager {
    constructor() {
        this.currentCurrency = this.getStoredCurrency() || 'USD';
        this.setupCurrencyChangeListener();
    }

    getStoredCurrency() {
        return localStorage.getItem('currency') || 'USD';
    }

    setCurrency(currency) {
        if (currencyRates[currency]) {
            this.currentCurrency = currency;
            localStorage.setItem('currency', currency);
            this.updatePricesInDOM();
        }
    }

    getCurrentCurrency() {
        return this.currentCurrency;
    }

    convert(priceInUSD) {
        return priceInUSD * currencyRates[this.currentCurrency];
    }

    format(priceInUSD) {
        const converted = this.convert(priceInUSD);
        const symbol = currencySymbols[this.currentCurrency];
        
        if (this.currentCurrency === 'MAD') {
            return `${converted.toFixed(2)} ${symbol}`;
        } else {
            return `${symbol}${converted.toFixed(2)}`;
        }
    }

    updatePricesInDOM() {
        document.querySelectorAll('[data-price]').forEach(element => {
            const priceUSD = parseFloat(element.getAttribute('data-price'));
            element.textContent = this.format(priceUSD);
        });
    }

    setupCurrencyChangeListener() {
        const currencySelect = document.getElementById('currencySelect');
        if (currencySelect) {
            currencySelect.value = this.currentCurrency;
            currencySelect.addEventListener('change', (e) => {
                this.setCurrency(e.target.value);
            });
        }
    }
}

// Theme Manager
class ThemeManager {
    constructor() {
        this.isDarkMode = this.getStoredTheme() !== 'light';
        this.setupThemeToggle();
        this.applyTheme();
    }

    getStoredTheme() {
        return localStorage.getItem('theme') || 'dark';
    }

    setTheme(theme) {
        this.isDarkMode = theme === 'dark';
        localStorage.setItem('theme', theme);
        this.applyTheme();
    }

    applyTheme() {
        const body = document.body;
        if (this.isDarkMode) {
            body.classList.remove('light-mode');
        } else {
            body.classList.add('light-mode');
        }
        this.updateThemeToggleButton();
    }

    updateThemeToggleButton() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (this.isDarkMode) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = this.isDarkMode ? 'light' : 'dark';
                this.setTheme(newTheme);
            });
        }
    }

    toggle() {
        const newTheme = this.isDarkMode ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Toast Notification System
class Toast {
    static show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${iconMap[type] || iconMap.info} toast-icon"></i>
            <span>${message}</span>
            <button class="toast-close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(toast);

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });

        if (duration > 0) {
            setTimeout(() => {
                toast.remove();
            }, duration);
        }
    }

    static success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    static error(message, duration = 3000) {
        this.show(message, 'error', duration);
    }

    static info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
}

// Scroll animations
class ScrollAnimations {
    static init() {
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

        document.querySelectorAll('.fade-in-scroll').forEach(element => {
            observer.observe(element);
        });
    }
}

// Smooth scroll to section
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Format number
function formatNumber(num) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(num);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Get query parameter
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        Toast.success(i18n.t('msg_form_sent'));
    } catch (err) {
        Toast.error(i18n.t('msg_error'));
    }
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone
function validatePhone(phone) {
    const re = /^[0-9+\-\s()]+$/;
    return re.test(phone) && phone.length >= 9;
}

// Get initials from name
function getInitials(name) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Initialize all utilities
function initializeUtilities() {
    window.currencyManager = new CurrencyManager();
    window.themeManager = new ThemeManager();
    ScrollAnimations.init();
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUtilities);
} else {
    initializeUtilities();
}
