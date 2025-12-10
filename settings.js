// ============================================
// SETTINGS MANAGEMENT MODULE
// ============================================

class SettingsManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.defaultSettings = this.getDefaultSettings();
        this.currentSettings = this.loadSettings();
        this.init();
    }

    init() {
        this.setupSettingsSync();
    }

    // ============================================
    // SETTINGS STRUCTURE
    // ============================================

    getDefaultSettings() {
        return {
            // Contact Information
            contact: {
                email: 'hdiyan122@gmail.com',
                whatsapp: '+1234567890',
                paypal: 'business@paypal.com',
                instagram: '@munjiz',
                phone: '+1234567890'
            },

            // Currency Settings
            currency: {
                default: 'USD',
                available: ['USD', 'EUR', 'MAD'],
                exchangeRates: {
                    'USD': 1.0,
                    'EUR': 0.85,
                    'MAD': 10.0
                }
            },

            // Language Settings
            language: {
                default: 'en',
                available: ['en', 'ar', 'fr'],
                rtl: ['ar']
            },

            // Theme Settings
            theme: {
                default: 'dark',
                available: ['dark', 'light']
            },

            // Business Settings
            business: {
                name: 'Munjiz',
                description: 'Professional Web & Digital Services',
                logo: 'https://via.placeholder.com/200x100',
                timezone: 'UTC'
            },

            // Email Settings
            email: {
                service: 'emailjs',
                publicKey: 'FpbbU5jLTD80qCWLz',
                serviceId: 'service_hjaklhd',
                templateId: 'template_fhe6wgg',
                adminEmail: 'hdiyan122@gmail.com'
            },

            // Security Settings
            security: {
                requirePasswordOnAdmin: true,
                sessionTimeout: 3600000, // 1 hour
                enableAnalytics: true
            },

            // Notification Settings
            notifications: {
                emailOnNewOrder: true,
                emailOnOrderStatusChange: true,
                adminNotifications: true
            }
        };
    }

    // ============================================
    // LOAD & SAVE SETTINGS
    // ============================================

    loadSettings() {
        const stored = localStorage.getItem('munjizSettings');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse settings:', e);
                return this.defaultSettings;
            }
        }
        return this.defaultSettings;
    }

    saveSettings() {
        try {
            localStorage.setItem('munjizSettings', JSON.stringify(this.currentSettings));
            return true;
        } catch (e) {
            console.error('Failed to save settings:', e);
            return false;
        }
    }

    resetToDefaults() {
        if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
            this.currentSettings = JSON.parse(JSON.stringify(this.defaultSettings));
            this.saveSettings();
            return true;
        }
        return false;
    }

    setupSettingsSync() {
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'munjizSettings') {
                this.currentSettings = JSON.parse(e.newValue);
            }
        });
    }

    // ============================================
    // CONTACT SETTINGS
    // ============================================

    getContactSettings() {
        return this.currentSettings.contact;
    }

    updateContactSettings(contact) {
        this.currentSettings.contact = { ...this.currentSettings.contact, ...contact };
        this.saveSettings();
        return this.currentSettings.contact;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]{10,}$/;
        return re.test(phone);
    }

    // ============================================
    // CURRENCY SETTINGS
    // ============================================

    getCurrencySettings() {
        return this.currentSettings.currency;
    }

    getDefaultCurrency() {
        return this.currentSettings.currency.default;
    }

    getAvailableCurrencies() {
        return this.currentSettings.currency.available;
    }

    updateCurrencySettings(currency) {
        this.currentSettings.currency = { ...this.currentSettings.currency, ...currency };
        this.saveSettings();
        return this.currentSettings.currency;
    }

    setDefaultCurrency(code) {
        if (this.currentSettings.currency.available.includes(code)) {
            this.currentSettings.currency.default = code;
            this.saveSettings();
            return true;
        }
        return false;
    }

    addCurrency(code, exchangeRate = 1.0) {
        if (!this.currentSettings.currency.available.includes(code)) {
            this.currentSettings.currency.available.push(code);
            this.currentSettings.currency.exchangeRates[code] = exchangeRate;
            this.saveSettings();
            return true;
        }
        return false;
    }

    removeCurrency(code) {
        if (code !== this.currentSettings.currency.default) {
            const index = this.currentSettings.currency.available.indexOf(code);
            if (index > -1) {
                this.currentSettings.currency.available.splice(index, 1);
                delete this.currentSettings.currency.exchangeRates[code];
                this.saveSettings();
                return true;
            }
        }
        return false;
    }

    convertCurrency(amount, fromCurrency, toCurrency) {
        const fromRate = this.currentSettings.currency.exchangeRates[fromCurrency] || 1;
        const toRate = this.currentSettings.currency.exchangeRates[toCurrency] || 1;
        return (amount / fromRate) * toRate;
    }

    updateExchangeRate(code, rate) {
        if (this.currentSettings.currency.exchangeRates.hasOwnProperty(code)) {
            this.currentSettings.currency.exchangeRates[code] = rate;
            this.saveSettings();
            return true;
        }
        return false;
    }

    // ============================================
    // LANGUAGE SETTINGS
    // ============================================

    getLanguageSettings() {
        return this.currentSettings.language;
    }

    getDefaultLanguage() {
        return this.currentSettings.language.default;
    }

    getAvailableLanguages() {
        return this.currentSettings.language.available;
    }

    updateLanguageSettings(language) {
        this.currentSettings.language = { ...this.currentSettings.language, ...language };
        this.saveSettings();
        return this.currentSettings.language;
    }

    setDefaultLanguage(code) {
        if (this.currentSettings.language.available.includes(code)) {
            this.currentSettings.language.default = code;
            this.saveSettings();
            return true;
        }
        return false;
    }

    isRTL(languageCode) {
        return this.currentSettings.language.rtl.includes(languageCode);
    }

    addLanguage(code, isRTL = false) {
        if (!this.currentSettings.language.available.includes(code)) {
            this.currentSettings.language.available.push(code);
            if (isRTL) {
                this.currentSettings.language.rtl.push(code);
            }
            this.saveSettings();
            return true;
        }
        return false;
    }

    removeLanguage(code) {
        if (code !== this.currentSettings.language.default) {
            const index = this.currentSettings.language.available.indexOf(code);
            if (index > -1) {
                this.currentSettings.language.available.splice(index, 1);
                const rtlIndex = this.currentSettings.language.rtl.indexOf(code);
                if (rtlIndex > -1) {
                    this.currentSettings.language.rtl.splice(rtlIndex, 1);
                }
                this.saveSettings();
                return true;
            }
        }
        return false;
    }

    // ============================================
    // THEME SETTINGS
    // ============================================

    getThemeSettings() {
        return this.currentSettings.theme;
    }

    getDefaultTheme() {
        return this.currentSettings.theme.default;
    }

    setDefaultTheme(theme) {
        if (this.currentSettings.theme.available.includes(theme)) {
            this.currentSettings.theme.default = theme;
            this.saveSettings();
            return true;
        }
        return false;
    }

    applyTheme(theme) {
        if (this.currentSettings.theme.available.includes(theme)) {
            if (theme === 'light') {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
            this.setDefaultTheme(theme);
            return true;
        }
        return false;
    }

    // ============================================
    // BUSINESS SETTINGS
    // ============================================

    getBusinessSettings() {
        return this.currentSettings.business;
    }

    updateBusinessSettings(business) {
        this.currentSettings.business = { ...this.currentSettings.business, ...business };
        this.saveSettings();
        return this.currentSettings.business;
    }

    // ============================================
    // EMAIL SETTINGS
    // ============================================

    getEmailSettings() {
        return this.currentSettings.email;
    }

    updateEmailSettings(email) {
        this.currentSettings.email = { ...this.currentSettings.email, ...email };
        this.saveSettings();
        return this.currentSettings.email;
    }

    getAdminEmail() {
        return this.currentSettings.email.adminEmail;
    }

    // ============================================
    // SECURITY SETTINGS
    // ============================================

    getSecuritySettings() {
        return this.currentSettings.security;
    }

    updateSecuritySettings(security) {
        this.currentSettings.security = { ...this.currentSettings.security, ...security };
        this.saveSettings();
        return this.currentSettings.security;
    }

    getSessionTimeout() {
        return this.currentSettings.security.sessionTimeout;
    }

    // ============================================
    // NOTIFICATION SETTINGS
    // ============================================

    getNotificationSettings() {
        return this.currentSettings.notifications;
    }

    updateNotificationSettings(notifications) {
        this.currentSettings.notifications = { ...this.currentSettings.notifications, ...notifications };
        this.saveSettings();
        return this.currentSettings.notifications;
    }

    shouldEmailOnNewOrder() {
        return this.currentSettings.notifications.emailOnNewOrder;
    }

    shouldEmailOnStatusChange() {
        return this.currentSettings.notifications.emailOnOrderStatusChange;
    }

    // ============================================
    // GENERAL SETTINGS
    // ============================================

    getSetting(path) {
        const keys = path.split('.');
        let value = this.currentSettings;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }

        return value;
    }

    setSetting(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let obj = this.currentSettings;

        for (const key of keys) {
            if (!(key in obj) || typeof obj[key] !== 'object') {
                obj[key] = {};
            }
            obj = obj[key];
        }

        obj[lastKey] = value;
        this.saveSettings();
        return true;
    }

    getAllSettings() {
        return JSON.parse(JSON.stringify(this.currentSettings));
    }

    importSettings(settings) {
        try {
            this.currentSettings = JSON.parse(JSON.stringify(settings));
            this.saveSettings();
            return true;
        } catch (e) {
            console.error('Failed to import settings:', e);
            return false;
        }
    }

    exportSettings() {
        return JSON.stringify(this.currentSettings, null, 2);
    }

    downloadSettingsBackup() {
        const backup = this.exportSettings();
        const blob = new Blob([backup], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `settings_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // ============================================
    // VALIDATION
    // ============================================

    validateSettings(settings = this.currentSettings) {
        const errors = [];

        // Validate contact
        if (settings.contact.email && !this.validateEmail(settings.contact.email)) {
            errors.push('Invalid email in contact settings');
        }

        // Validate currency
        if (settings.currency.default && !settings.currency.available.includes(settings.currency.default)) {
            errors.push('Default currency not in available currencies');
        }

        // Validate language
        if (settings.language.default && !settings.language.available.includes(settings.language.default)) {
            errors.push('Default language not in available languages');
        }

        // Validate theme
        if (settings.theme.default && !settings.theme.available.includes(settings.theme.default)) {
            errors.push('Default theme not in available themes');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
}

// Initialize when dashboard is ready
if (typeof dashboard !== 'undefined') {
    const settingsManager = new SettingsManager(dashboard);
    window.settingsManager = settingsManager;
}
