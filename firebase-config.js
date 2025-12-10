/**
 * Firebase Configuration & Database Management
 * Handles all database operations for products, orders, and settings
 */

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDjX3rK9mL4nP5qR6sT7uV8wX9yZ0aB1cD",
    authDomain: "munjiz-store.firebaseapp.com",
    projectId: "munjiz-store",
    storageBucket: "munjiz-store.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefg1234567890hijkl"
};

// Initialize Firebase (using Realtime Database)
let firebaseInitialized = false;
let database = null;

/**
 * Initialize Firebase Database
 * Note: Using a public Firebase database for demonstration
 * For production, secure your database with proper authentication rules
 */
function initializeFirebase() {
    if (firebaseInitialized) return;

    try {
        // Load Firebase scripts dynamically
        const scripts = [
            'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js',
            'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js'
        ];

        let loadedCount = 0;
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => {
                loadedCount++;
                if (loadedCount === scripts.length) {
                    setupFirebaseDatabase();
                }
            };
            document.head.appendChild(script);
        });
    } catch (error) {
        console.error('Firebase initialization error:', error);
        // Fallback to localStorage
        useLocalStorageDatabase();
    }
}

/**
 * Setup Firebase Realtime Database
 */
function setupFirebaseDatabase() {
    try {
        // Initialize Firebase
        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(firebaseConfig);
            database = firebase.database();
            firebaseInitialized = true;
            console.log('Firebase initialized successfully');

            // Load initial data
            loadProductsFromFirebase();
        } else {
            useLocalStorageDatabase();
        }
    } catch (error) {
        console.error('Firebase setup error:', error);
        useLocalStorageDatabase();
    }
}

/**
 * Database Manager Class
 * Handles all CRUD operations for products
 */
class DatabaseManager {
    constructor() {
        this.useFirebase = false;
        this.products = [];
        this.init();
    }

    async init() {
        // Try Firebase first, fall back to localStorage
        if (typeof firebase !== 'undefined' && database) {
            this.useFirebase = true;
            await this.loadProductsFromFirebase();
        } else {
            this.loadProductsFromLocalStorage();
        }
    }

    /**
     * Load products from Firebase
     */
    async loadProductsFromFirebase() {
        try {
            const ref = firebase.database().ref('products');
            ref.on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    this.products = Object.values(data);
                    // Update the products on the website
                    if (typeof productManager !== 'undefined') {
                        productManager.updateProductsFromDatabase(this.products);
                    }
                } else {
                    // Initialize with default products
                    this.initializeDefaultProducts();
                }
            });
        } catch (error) {
            console.error('Error loading products from Firebase:', error);
            this.loadProductsFromLocalStorage();
        }
    }

    /**
     * Load products from localStorage (fallback)
     */
    loadProductsFromLocalStorage() {
        const stored = localStorage.getItem('munjizProducts');
        if (stored) {
            try {
                this.products = JSON.parse(stored);
            } catch (error) {
                console.error('Error parsing stored products:', error);
                this.products = [];
            }
        }

        if (this.products.length === 0) {
            this.initializeDefaultProducts();
        }

        // Update the products on the website
        if (typeof productManager !== 'undefined') {
            productManager.updateProductsFromDatabase(this.products);
        }
    }

    /**
     * Initialize with default products
     */
    initializeDefaultProducts() {
        this.products = [
            {
                id: '1',
                name: 'Django Web Development',
                category: 'courses',
                price: 55,
                image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
                description: 'Learn Django framework from basics to advanced concepts',
                featured: true,
                created: new Date().toISOString()
            },
            {
                id: '2',
                name: 'WhatsApp Bot Development',
                category: 'ai-tools',
                price: 155,
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
                description: 'Build powerful automated WhatsApp bots for your business',
                featured: true,
                created: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Professional Website Design',
                category: 'services',
                price: 550,
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
                description: 'Complete website design and development service',
                featured: true,
                created: new Date().toISOString()
            },
            {
                id: '4',
                name: 'Digital Marketing Academy',
                category: 'ebooks',
                price: 999,
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
                description: 'Comprehensive digital marketing training program',
                featured: false,
                created: new Date().toISOString()
            },
            {
                id: '5',
                name: 'Profit Bundle - All Courses',
                category: 'ebooks',
                price: 25,
                image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=500&h=300&fit=crop',
                description: 'Special bundle with all our courses and resources',
                featured: true,
                created: new Date().toISOString()
            }
        ];

        this.saveProducts();
    }

    /**
     * Save all products
     */
    async saveProducts() {
        if (this.useFirebase && database) {
            try {
                const ref = firebase.database().ref('products');
                const productsObj = {};
                this.products.forEach(p => {
                    productsObj[p.id] = p;
                });
                await ref.set(productsObj);
                console.log('Products saved to Firebase');
            } catch (error) {
                console.error('Error saving to Firebase:', error);
                localStorage.setItem('munjizProducts', JSON.stringify(this.products));
            }
        } else {
            localStorage.setItem('munjizProducts', JSON.stringify(this.products));
        }
    }

    /**
     * Add new product
     */
    async addProduct(product) {
        const newProduct = {
            id: Date.now().toString(),
            ...product,
            created: new Date().toISOString()
        };

        this.products.push(newProduct);
        await this.saveProducts();

        // Update on website
        if (typeof productManager !== 'undefined') {
            productManager.updateProductsFromDatabase(this.products);
        }

        return newProduct;
    }

    /**
     * Update product
     */
    async updateProduct(productId, updates) {
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updates };
            await this.saveProducts();

            // Update on website
            if (typeof productManager !== 'undefined') {
                productManager.updateProductsFromDatabase(this.products);
            }

            return this.products[index];
        }
        return null;
    }

    /**
     * Delete product
     */
    async deleteProduct(productId) {
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            this.products.splice(index, 1);
            await this.saveProducts();

            // Update on website
            if (typeof productManager !== 'undefined') {
                productManager.updateProductsFromDatabase(this.products);
            }

            return true;
        }
        return false;
    }

    /**
     * Get all products
     */
    getAllProducts() {
        return [...this.products];
    }

    /**
     * Get products by category
     */
    getProductsByCategory(category) {
        return this.products.filter(p => p.category === category);
    }

    /**
     * Search products
     */
    searchProducts(query) {
        const lowerQuery = query.toLowerCase();
        return this.products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        );
    }
}

/**
 * Fallback: Use localStorage instead of Firebase
 */
function useLocalStorageDatabase() {
    console.log('Using localStorage for database');
    // Database manager will fall back to localStorage automatically
}

/**
 * Load products from Firebase (for real-time updates)
 */
function loadProductsFromFirebase() {
    try {
        if (typeof firebase !== 'undefined' && firebase.database) {
            const ref = firebase.database().ref('products');
            ref.on('value', (snapshot) => {
                const data = snapshot.val();
                if (data && typeof productManager !== 'undefined') {
                    const products = Object.values(data);
                    productManager.updateProductsFromDatabase(products);
                }
            });
        }
    } catch (error) {
        console.error('Firebase loading error:', error);
    }
}

/**
 * Initialize database when document is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize database manager
        const dbManager = new DatabaseManager();
        window.dbManager = dbManager;

        // Try to initialize Firebase
        initializeFirebase();
    });
} else {
    const dbManager = new DatabaseManager();
    window.dbManager = dbManager;
    initializeFirebase();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DatabaseManager, initializeFirebase, firebaseConfig };
}
