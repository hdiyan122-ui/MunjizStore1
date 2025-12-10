/**
 * Modals Module
 * Handles contact forms and product contact modals
 * Uses centralized EmailJS handler for email delivery
 */

class ModalManager {
    constructor() {
        this.contactModal = document.getElementById('contactModal');
        this.productContactModal = document.getElementById('productContactModal');
        this.contactForm = document.getElementById('contactForm');
        this.productContactForm = document.getElementById('productContactForm');
        
        this.currentProduct = null;
        
        this.setupEventListeners();
    }

    openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    setupEventListeners() {
        // Contact modal close buttons
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal);
            });
        });

        // Close modals on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Contact form submission
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleContactFormSubmit(e));
        }

        // Product contact form submission
        if (this.productContactForm) {
            this.productContactForm.addEventListener('submit', (e) => this.handleProductContactFormSubmit(e));
        }

        // Open contact modal buttons
        this.setupContactModalTriggers();

        // Populate contact form product select
        this.populateContactFormProducts();
    }

    setupContactModalTriggers() {
        const triggers = document.querySelectorAll('[id$="ContactBtn"]');
        triggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(this.contactModal);
            });
        });
    }

    populateContactFormProducts() {
        const productSelect = document.getElementById('contactProduct');
        if (!productSelect) return;

        productManager.getAllProducts().forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = i18n.t(product.title);
            productSelect.appendChild(option);
        });
    }

    handleContactFormSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const product = document.getElementById('contactProduct').value;
        const message = document.getElementById('contactMessage').value.trim();

        // Validation
        if (!name || !email || !message) {
            Toast.error(i18n.t('msg_error'));
            return;
        }

        if (!validateEmail(email)) {
            Toast.error(i18n.t('msg_error') + ': ' + i18n.t('form_email'));
            return;
        }

        // Get product name
        const productName = product ? i18n.t(productManager.getProductById(parseInt(product)).title) : 'General Inquiry';
        
        // Disable submit button
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Send email
        if (typeof sendContactEmail === 'function') {
            sendContactEmail(name, email, message, productName)
                .then((response) => {
                    Toast.success('Your message has been sent successfully. We will contact you shortly.');
                    this.contactForm.reset();
                    this.closeModal(this.contactModal);
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                })
                .catch((error) => {
                    console.error('Contact form error:', error);
                    Toast.error('Failed to send message. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });
        } else {
            Toast.error('Email service not loaded. Please refresh the page.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    handleProductContactFormSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('prodContactName').value.trim();
        const email = document.getElementById('prodContactEmail').value.trim();
        const phone = document.getElementById('prodContactPhone').value.trim();
        const message = document.getElementById('prodContactMessage').value.trim();

        // Validation
        if (!name || !email || !phone) {
            Toast.error(i18n.t('msg_error'));
            return;
        }

        if (!validateEmail(email)) {
            Toast.error(i18n.t('msg_error') + ': ' + i18n.t('form_email'));
            return;
        }

        if (!validatePhone(phone)) {
            Toast.error(i18n.t('msg_error') + ': ' + i18n.t('form_phone'));
            return;
        }

        // Get product info
        const productTitle = this.currentProduct ? i18n.t(this.currentProduct.title) : 'Product';
        const price = this.currentProduct ? currencyManager.format(this.currentProduct.price) : 'N/A';
        
        // Disable submit button
        const submitBtn = this.productContactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Send email
        if (typeof sendProductContactEmail === 'function') {
            sendProductContactEmail(name, email, phone, productTitle, price, message)
                .then((response) => {
                    Toast.success('Your message has been sent successfully. We will contact you shortly.');
                    this.productContactForm.reset();
                    this.closeModal(this.productContactModal);
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                })
                .catch((error) => {
                    console.error('Product contact form error:', error);
                    Toast.error('Failed to send message. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });
        } else {
            Toast.error('Email service not loaded. Please refresh the page.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    // Note: Email sending is handled by emailjs-handler.js
    // This method is kept for backwards compatibility
}

// Open product contact modal
function openProductContactModal(product) {
    const modalManager = window.modalManager;
    if (!modalManager) return;

    modalManager.currentProduct = product;
    
    // Update modal content
    const infoDiv = document.getElementById('productContactInfo');
    if (infoDiv) {
        const price = currencyManager.format(product.price);
        infoDiv.innerHTML = `
            <h3>${i18n.t(product.title)}</h3>
            <p>${i18n.t(product.description)}</p>
            <div class="product-price-display">${i18n.t('form_price') || 'Price'}: ${price}</div>
        `;
    }

    modalManager.openModal(modalManager.productContactModal);
}

// Initialize modal manager
let modalManager = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        modalManager = new ModalManager();
        window.modalManager = modalManager;
    });
} else {
    modalManager = new ModalManager();
    window.modalManager = modalManager;
}

// Make functions available globally
window.openProductContactModal = openProductContactModal;
