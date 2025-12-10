/**
 * Internationalization Module
 * Handles Arabic, English, and French translations
 */

const translations = {
    en: {
        // Navigation
        nav_home: 'Home',
        nav_products: 'Products',
        nav_categories: 'Categories',
        nav_contact: 'Contact Us',

        // Categories
        cat_courses: 'Courses',
        cat_ebooks: 'E-books',
        cat_ai_tools: 'AI Tools',
        cat_services: 'Services',

        // Search
        search_placeholder: 'Search products...',

        // Hero Section
        hero_title: 'Munjiz — Power Your Digital Future',
        hero_subtitle: 'Courses, E-books, AI services, and digital solutions.',

        // CTAs
        cta_contact: 'Contact Us',
        cta_explore: 'Explore Products',
        cta_final_title: 'Ready to Transform Your Digital Future?',
        cta_final_subtitle: 'Start your journey with Munjiz today',

        // Featured Section
        featured_title: 'Featured Products',
        featured_subtitle: 'Handpicked digital solutions for your success',

        // Products Section
        products_title: 'All Products',
        products_subtitle: 'Discover our complete collection',

        // Filters
        filter_category: 'Category',
        filter_price: 'Price Range',
        filter_sort: 'Sort By',
        sort_newest: 'Newest',
        sort_popular: 'Most Popular',
        sort_price_low: 'Price: Low to High',
        sort_price_high: 'Price: High to Low',
        btn_reset_filters: 'Reset Filters',

        // Categories Section
        categories_title: 'Explore Categories',
        categories_subtitle: 'Find exactly what you need',

        // Why Section
        why_title: 'Why Choose Munjiz?',
        why_ai: 'AI-Powered Solutions',
        why_ai_desc: 'Advanced artificial intelligence integrated into our products',
        why_fast: 'Lightning Fast Delivery',
        why_fast_desc: 'Instant access to digital products and solutions',
        why_premium: 'Premium Content',
        why_premium_desc: 'High-quality, professionally crafted digital products',
        why_secure: '100% Secure',
        why_secure_desc: 'Your data and transactions are protected',
        why_support: 'Expert Support',
        why_support_desc: '24/7 customer support and assistance',
        why_global: 'Global Access',
        why_global_desc: 'Available worldwide with multiple currencies',

        // Testimonials
        testimonials_title: 'What Our Customers Say',

        // Footer
        footer_desc: 'Premium digital products and AI-powered solutions',
        footer_links: 'Quick Links',
        footer_contact: 'Contact Information',
        footer_categories: 'Categories',
        footer_rights: 'All rights reserved.',
        footer_ai_designed: 'Designed using Artificial Intelligence',

        // Contact Modal
        contact_modal_title: 'Get in Touch',
        contact_direct: 'Direct Contact',
        product_contact_title: 'Complete Your Order',

        // Forms
        form_name: 'Full Name',
        form_email: 'Email',
        form_phone: 'WhatsApp / Phone',
        form_product: 'Product Interested In',
        form_message: 'Message',
        form_submit: 'Send Message',

        // Products
        product_django_title: 'Course — Learn Django Web Development With 5 Real World Projects',
        product_django_desc: 'Full Django training with 5 practical real-world projects.',
        product_whatsapp_title: 'WhatsApp Bot Powered by Artificial Intelligence',
        product_whatsapp_desc: 'Fully functional WhatsApp automation with AI brain.',
        product_website_title: 'I Will Create Your Professional Website',
        product_website_desc: 'Modern responsive website built tailored to customer needs.',
        product_digital_title: 'PDF Course — Define Digital Academy: Sell More With Google',
        product_digital_desc: 'Premium digital selling strategy guide.',
        product_bundle_title: 'PDF Book — Ultimate Digital Profit Bundle',
        product_bundle_desc: 'Complete digital learning bundle ready for instant profit.',

        // Contact us button
        product_contact_us: 'Contact us to complete this order',

        // Messages
        msg_form_sent: 'Message sent successfully! We will contact you soon.',
        msg_error: 'An error occurred. Please try again.',
    },

    ar: {
        // Navigation
        nav_home: 'الرئيسية',
        nav_products: 'المنتجات',
        nav_categories: 'الفئات',
        nav_contact: 'اتصل بنا',

        // Categories
        cat_courses: 'الدورات',
        cat_ebooks: 'الكتب الإلكترونية',
        cat_ai_tools: 'أدوات الذكاء الاصطناعي',
        cat_services: 'الخدمات',

        // Search
        search_placeholder: 'ابحث عن المنتجات...',

        // Hero Section
        hero_title: 'منجز — قوي مستقبلك الرقمي',
        hero_subtitle: 'الدورات والكتب الإلكترونية وخدمات الذكاء الاصطناعي والحلول الرقمية.',

        // CTAs
        cta_contact: 'اتصل بنا',
        cta_explore: 'استكشف المنتجات',
        cta_final_title: 'هل أنت مستعد لتحويل مستقبلك الرقمي؟',
        cta_final_subtitle: 'ابدأ رحلتك مع منجز اليوم',

        // Featured Section
        featured_title: 'المنتجات المميزة',
        featured_subtitle: 'حلول رقمية مختارة لنجاحك',

        // Products Section
        products_title: 'جميع المنتجات',
        products_subtitle: 'اكتشف مجموعتنا الكاملة',

        // Filters
        filter_category: 'الفئة',
        filter_price: 'نطاق السعر',
        filter_sort: 'الترتيب حسب',
        sort_newest: 'الأحدث',
        sort_popular: 'الأكثر شهرة',
        sort_price_low: 'السعر: من الأقل إلى الأعلى',
        sort_price_high: 'السعر: من الأعلى إلى الأقل',
        btn_reset_filters: 'إعادة تعيين الفلاتر',

        // Categories Section
        categories_title: 'استكشف الفئات',
        categories_subtitle: 'اعثر على ما تحتاجه بالضبط',

        // Why Section
        why_title: 'لماذا اختيار منجز؟',
        why_ai: 'حلول مدعومة بالذكاء الاصطناعي',
        why_ai_desc: 'الذكاء الاصطناعي المتقدم المدمج في منتجاتنا',
        why_fast: 'توصيل سريع البرق',
        why_fast_desc: 'وصول فوري للمنتجات والحلول الرقمية',
        why_premium: 'محتوى متميز',
        why_premium_desc: 'منتجات رقمية عالية الجودة واحترافية',
        why_secure: '100٪ آمن',
        why_secure_desc: 'بياناتك ومعاملاتك محمية',
        why_support: 'دعم الخبراء',
        why_support_desc: 'دعم العملاء 24/7 والمساعدة',
        why_global: 'الوصول العالمي',
        why_global_desc: 'متاح في جميع أنحاء العالم مع عملات متعددة',

        // Testimonials
        testimonials_title: 'ماذا يقول عملاؤنا',

        // Footer
        footer_desc: 'منتجات رقمية متميزة وحلول مدعومة بالذكاء الاصطناعي',
        footer_links: 'روابط سريعة',
        footer_contact: 'معلومات الاتصال',
        footer_categories: 'الفئات',
        footer_rights: 'جميع الحقوق محفوظة.',
        footer_ai_designed: 'صُمم باستخدام الذكاء الاصطناعي',

        // Contact Modal
        contact_modal_title: 'تواصل معنا',
        contact_direct: 'الاتصال المباشر',
        product_contact_title: 'أكمل طلبك',

        // Forms
        form_name: 'الاسم الكامل',
        form_email: 'البريد الإلكتروني',
        form_phone: 'WhatsApp / الهاتف',
        form_product: 'المنتج المهتم به',
        form_message: 'الرسالة',
        form_submit: 'إرسال الرسالة',

        // Products
        product_django_title: 'دورة — تعلم تطوير Django باستخدام 5 مشاريع واقعية',
        product_django_desc: 'تدريب كامل على Django مع 5 مشاريع عملية حقيقية.',
        product_whatsapp_title: 'روبوت WhatsApp مدعوم بالذكاء الاصطناعي',
        product_whatsapp_desc: 'أتمتة WhatsApp كاملة الوظائف مع دماغ ذكي.',
        product_website_title: 'سأقوم بإنشاء موقع الويب المتخصص الخاص بك',
        product_website_desc: 'موقع ويب حديث وسريع الاستجابة مصمم حسب احتياجاتك.',
        product_digital_title: 'دورة PDF — تعريف الأكاديمية الرقمية: بيع أكثر مع Google',
        product_digital_desc: 'دليل استراتيجية البيع الرقمي المتميز.',
        product_bundle_title: 'كتاب PDF — حزمة الربح الرقمي النهائية',
        product_bundle_desc: 'حزمة التعلم الرقمي الكاملة جاهزة للربح الفوري.',

        // Contact us button
        product_contact_us: 'اتصل بنا لإكمال طلبك',

        // Messages
        msg_form_sent: 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.',
        msg_error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    },

    fr: {
        // Navigation
        nav_home: 'Accueil',
        nav_products: 'Produits',
        nav_categories: 'Catégories',
        nav_contact: 'Nous Contacter',

        // Categories
        cat_courses: 'Cours',
        cat_ebooks: 'E-books',
        cat_ai_tools: 'Outils IA',
        cat_services: 'Services',

        // Search
        search_placeholder: 'Rechercher des produits...',

        // Hero Section
        hero_title: 'Munjiz — Alimentez Votre Avenir Numérique',
        hero_subtitle: 'Cours, E-books, services IA et solutions numériques.',

        // CTAs
        cta_contact: 'Nous Contacter',
        cta_explore: 'Découvrir les Produits',
        cta_final_title: 'Prêt à Transformer Votre Avenir Numérique?',
        cta_final_subtitle: 'Commencez votre voyage avec Munjiz aujourd\'hui',

        // Featured Section
        featured_title: 'Produits en Vedette',
        featured_subtitle: 'Solutions numériques soigneusement sélectionnées pour votre succès',

        // Products Section
        products_title: 'Tous les Produits',
        products_subtitle: 'Découvrez notre collection complète',

        // Filters
        filter_category: 'Catégorie',
        filter_price: 'Gamme de Prix',
        filter_sort: 'Trier par',
        sort_newest: 'Le plus Récent',
        sort_popular: 'Le Plus Populaire',
        sort_price_low: 'Prix: Bas à Haut',
        sort_price_high: 'Prix: Haut à Bas',
        btn_reset_filters: 'Réinitialiser les Filtres',

        // Categories Section
        categories_title: 'Explorez les Catégories',
        categories_subtitle: 'Trouvez exactement ce que vous recherchez',

        // Why Section
        why_title: 'Pourquoi Choisir Munjiz?',
        why_ai: 'Solutions Alimentées par l\'IA',
        why_ai_desc: 'Intelligence artificielle avancée intégrée dans nos produits',
        why_fast: 'Livraison Ultra-Rapide',
        why_fast_desc: 'Accès instantané aux produits et solutions numériques',
        why_premium: 'Contenu Premium',
        why_premium_desc: 'Produits numériques de haute qualité et professionnels',
        why_secure: '100% Sécurisé',
        why_secure_desc: 'Vos données et transactions sont protégées',
        why_support: 'Support Expert',
        why_support_desc: 'Support client 24/7 et assistance',
        why_global: 'Accès Mondial',
        why_global_desc: 'Disponible dans le monde entier avec plusieurs devises',

        // Testimonials
        testimonials_title: 'Ce Que Disent Nos Clients',

        // Footer
        footer_desc: 'Produits numériques premium et solutions alimentées par l\'IA',
        footer_links: 'Liens Rapides',
        footer_contact: 'Informations de Contact',
        footer_categories: 'Catégories',
        footer_rights: 'Tous droits réservés.',
        footer_ai_designed: 'Conçu avec l\'Intelligence Artificielle',

        // Contact Modal
        contact_modal_title: 'Entrez en Contact',
        contact_direct: 'Contact Direct',
        product_contact_title: 'Complétez Votre Commande',

        // Forms
        form_name: 'Nom Complet',
        form_email: 'Email',
        form_phone: 'WhatsApp / Téléphone',
        form_product: 'Produit Intéressé',
        form_message: 'Message',
        form_submit: 'Envoyer le Message',

        // Products
        product_django_title: 'Cours — Apprenez le Développement Django Avec 5 Projets Réels',
        product_django_desc: 'Formation complète Django avec 5 projets pratiques réels.',
        product_whatsapp_title: 'Bot WhatsApp Alimenté par l\'Intelligence Artificielle',
        product_whatsapp_desc: 'Automatisation WhatsApp complète avec cerveau IA.',
        product_website_title: 'Je Vais Créer Votre Site Web Professionnel',
        product_website_desc: 'Site web moderne et réactif construit selon vos besoins.',
        product_digital_title: 'Cours PDF — Définissez l\'Académie Numérique: Vendez Plus Avec Google',
        product_digital_desc: 'Guide stratégique de vente numérique premium.',
        product_bundle_title: 'Livre PDF — Bundle Profit Numérique Ultime',
        product_bundle_desc: 'Pack d\'apprentissage numérique complet prêt pour profit instantané.',

        // Contact us button
        product_contact_us: 'Nous Contacter Pour Compléter Votre Commande',

        // Messages
        msg_form_sent: 'Message envoyé avec succès! Nous vous contacterons bientôt.',
        msg_error: 'Une erreur s\'est produite. Veuillez réessayer.',
    }
};

class I18n {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'en';
        this.setupLanguageChangeListener();
        this.applyTranslations();
    }

    getStoredLanguage() {
        return localStorage.getItem('language');
    }

    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.applyTranslations();
            this.setPageDirection(lang);
            document.documentElement.lang = lang;
        }
    }

    setPageDirection(lang) {
        const htmlElement = document.documentElement;
        if (lang === 'ar') {
            htmlElement.setAttribute('dir', 'rtl');
        } else {
            htmlElement.setAttribute('dir', 'ltr');
        }
    }

    t(key) {
        return translations[this.currentLanguage][key] || translations['en'][key] || key;
    }

    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update select option labels
        document.querySelectorAll('select option[data-i18n]').forEach(option => {
            const key = option.getAttribute('data-i18n');
            option.textContent = this.t(key);
        });
    }

    setupLanguageChangeListener() {
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }
}

// Initialize i18n
const i18n = new I18n();
