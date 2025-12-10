/**
 * EmailJS Handler Module
 * Manages all email sending functionality for Munjiz website
 * Ensures reliable delivery to hdiyan122@gmail.com
 */

// Initialize EmailJS with correct public key
(function() {
    // Initialize with your public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init('FpbbU5jLTD80qCWLz');
        console.log('EmailJS initialized successfully');
    }
})();

/**
 * Send contact form email
 * @param {string} userName - User's full name
 * @param {string} userEmail - User's email address
 * @param {string} message - User's message
 * @param {string} productName - Product name (optional)
 */
function sendContactEmail(userName, userEmail, message, productName = 'General Inquiry') {
    return new Promise((resolve, reject) => {
        if (typeof emailjs === 'undefined') {
            reject({ error: 'EmailJS not loaded' });
            return;
        }

        // Prepare email parameters
        const templateParams = {
            to_email: 'hdiyan122@gmail.com',
            user_name: userName,
            user_email: userEmail,
            product_name: productName,
            user_message: message,
            reply_to: userEmail
        };

        // Send email using your service credentials
        emailjs.send('service_hjaklhd', 'template_fhe6wgg', templateParams)
            .then((response) => {
                console.log('Email sent successfully:', response);
                resolve(response);
            })
            .catch((error) => {
                console.error('Error sending email:', error);
                reject(error);
            });
    });
}

/**
 * Send product contact email
 * @param {string} userName - User's full name
 * @param {string} userEmail - User's email address
 * @param {string} userPhone - User's phone number
 * @param {string} productName - Product name
 * @param {string} productPrice - Product price
 * @param {string} message - User's message
 */
function sendProductContactEmail(userName, userEmail, userPhone, productName, productPrice, message = '') {
    return new Promise((resolve, reject) => {
        if (typeof emailjs === 'undefined') {
            reject({ error: 'EmailJS not loaded' });
            return;
        }

        // Prepare email parameters
        const templateParams = {
            to_email: 'hdiyan122@gmail.com',
            user_name: userName,
            user_email: userEmail,
            user_phone: userPhone,
            product_name: productName,
            product_price: productPrice,
            user_message: message || 'No additional questions',
            reply_to: userEmail
        };

        // Send email using your service credentials
        emailjs.send('service_hjaklhd', 'template_fhe6wgg', templateParams)
            .then((response) => {
                console.log('Product contact email sent successfully:', response);
                resolve(response);
            })
            .catch((error) => {
                console.error('Error sending product contact email:', error);
                reject(error);
            });
    });
}

/**
 * Handle contact form submission from Contact Us section
 * @param {HTMLFormElement} form - The form element
 */
function handleContactFormSubmit(form) {
    const userName = form.querySelector('[name="user_name"]').value.trim();
    const userEmail = form.querySelector('[name="user_email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    // Validation
    if (!userName || !userEmail || !message) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }

    if (!isValidEmail(userEmail)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Send email
    sendContactEmail(userName, userEmail, message)
        .then((response) => {
            showAlert('Your message has been sent successfully. We will contact you shortly.', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        })
        .catch((error) => {
            console.error('Contact form error:', error);
            showAlert('Failed to send message. Please try again or contact us directly.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        });
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone format
 * @param {string} phone - Phone to validate
 * @returns {boolean}
 */
function isValidPhone(phone) {
    const phoneRegex = /^[+\d\s\-()]{7,}$/;
    return phoneRegex.test(phone);
}

/**
 * Show alert message to user
 * @param {string} message - Message to show
 * @param {string} type - 'success', 'error', or 'info'
 */
function showAlert(message, type = 'info') {
    // Use Toast notifications if available
    if (typeof Toast !== 'undefined') {
        if (type === 'success') {
            Toast.success(message);
        } else if (type === 'error') {
            Toast.error(message);
        } else {
            Toast.info(message);
        }
    } else {
        // Fallback to browser alert
        alert(message);
    }
}

// Export functions for global use
window.emailjsHandler = {
    sendContactEmail,
    sendProductContactEmail,
    handleContactFormSubmit,
    isValidEmail,
    isValidPhone,
    showAlert
};
