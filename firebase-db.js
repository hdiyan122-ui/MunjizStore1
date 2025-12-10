/**
 * Firebase Database Module
 * Handles all Firestore operations for products, orders, and authentication
 * 
 * IMPORTANT: Before using this, follow FIREBASE-SETUP-GUIDE.md to:
 * 1. Create a Firebase project
 * 2. Enable Firestore Database
 * 3. Enable Authentication (Email/Password)
 * 4. Add your credentials to firebase-config.js
 * 5. Set up Firestore security rules
 */

class FirebaseDB {
    constructor() {
        this.db = null;
        this.auth = null;
        this.initialized = false;
        this.currentUser = null;
        this.productListeners = [];
    }

    /**
     * Initialize Firebase
     * Must be called before any database operations
     */
    async initialize() {
        if (this.initialized) return true;

        try {
            // Check if Firebase is available
            if (typeof firebase === 'undefined' || !firebase) {
                console.error('Firebase SDK not loaded. Add scripts to your HTML');
                return false;
            }

            // Get references from initialized Firebase app
            this.db = firebase.firestore();
            this.auth = firebase.auth();
            this.initialized = true;

            // Set up auth state listener
            this.auth.onAuthStateChanged(user => {
                this.currentUser = user;
                if (user) {
                    console.log('User authenticated:', user.email);
                    // Dispatch event for UI update
                    document.dispatchEvent(new CustomEvent('userAuthenticated', { detail: { user } }));
                } else {
                    console.log('User logged out');
                    document.dispatchEvent(new CustomEvent('userLoggedOut', {}));
                }
            });

            console.log('Firebase initialized successfully');
            return true;
        } catch (error) {
            console.error('Firebase initialization error:', error);
            return false;
        }
    }

    // ============================================
    // AUTHENTICATION METHODS
    // ============================================

    /**
     * Sign up new admin user
     */
    async signUp(email, password) {
        try {
            if (!this.initialized) await this.initialize();
            const result = await this.auth.createUserWithEmailAndPassword(email, password);
            return { success: true, user: result.user };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Sign in existing admin user
     */
    async signIn(email, password) {
        try {
            if (!this.initialized) await this.initialize();
            const result = await this.auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: result.user };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Sign out current user
     */
    async signOut() {
        try {
            if (!this.initialized) await this.initialize();
            await this.auth.signOut();
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get current authenticated user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // ============================================
    // PRODUCTS METHODS
    // ============================================

    /**
     * Save product to Firestore
     */
    async saveProduct(product) {
        try {
            if (!this.initialized) await this.initialize();
            if (!this.isAuthenticated()) throw new Error('User not authenticated');

            const productsRef = this.db.collection('products');
            
            if (product.id) {
                // Update existing product
                await productsRef.doc(product.id.toString()).set(product, { merge: true });
            } else {
                // Create new product
                const newDoc = await productsRef.add(product);
                product.id = newDoc.id;
                await productsRef.doc(newDoc.id).update({ id: newDoc.id });
            }
            
            console.log('Product saved:', product.id);
            return { success: true, product };
        } catch (error) {
            console.error('Save product error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete product from Firestore
     */
    async deleteProduct(productId) {
        try {
            if (!this.initialized) await this.initialize();
            if (!this.isAuthenticated()) throw new Error('User not authenticated');

            await this.db.collection('products').doc(productId.toString()).delete();
            console.log('Product deleted:', productId);
            return { success: true };
        } catch (error) {
            console.error('Delete product error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all products from Firestore
     */
    async getAllProducts() {
        try {
            if (!this.initialized) await this.initialize();

            const snapshot = await this.db.collection('products').get();
            const products = [];
            
            snapshot.forEach(doc => {
                products.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            console.log('Loaded products:', products.length);
            return { success: true, products };
        } catch (error) {
            console.error('Get products error:', error);
            return { success: false, error: error.message, products: [] };
        }
    }

    /**
     * Get product by ID
     */
    async getProduct(productId) {
        try {
            if (!this.initialized) await this.initialize();

            const doc = await this.db.collection('products').doc(productId.toString()).get();
            if (doc.exists) {
                return { success: true, product: { id: doc.id, ...doc.data() } };
            } else {
                return { success: false, error: 'Product not found' };
            }
        } catch (error) {
            console.error('Get product error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Listen for real-time product updates
     * Calls callback whenever products change
     */
    onProductsChange(callback) {
        try {
            if (!this.initialized) {
                console.warn('Firebase not initialized, using fallback');
                return;
            }

            // Real-time listener
            const unsubscribe = this.db.collection('products')
                .onSnapshot(snapshot => {
                    const products = [];
                    snapshot.forEach(doc => {
                        products.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                    callback(products);
                }, error => {
                    console.error('Real-time listener error:', error);
                });

            this.productListeners.push(unsubscribe);
            return unsubscribe;
        } catch (error) {
            console.error('Setup real-time listener error:', error);
        }
    }

    /**
     * Remove real-time listener
     */
    removeListener(unsubscribe) {
        if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
        }
    }

    /**
     * Search products by name or category
     */
    async searchProducts(query, category = null) {
        try {
            if (!this.initialized) await this.initialize();

            let ref = this.db.collection('products');

            if (category) {
                ref = ref.where('category', '==', category);
            }

            const snapshot = await ref.get();
            const results = [];

            snapshot.forEach(doc => {
                const product = { id: doc.id, ...doc.data() };
                if (product.name.toLowerCase().includes(query.toLowerCase())) {
                    results.push(product);
                }
            });

            return { success: true, products: results };
        } catch (error) {
            console.error('Search products error:', error);
            return { success: false, error: error.message, products: [] };
        }
    }

    // ============================================
    // ORDERS METHODS
    // ============================================

    /**
     * Save order to Firestore
     */
    async saveOrder(order) {
        try {
            if (!this.initialized) await this.initialize();

            const ordersRef = this.db.collection('orders');
            const newDoc = await ordersRef.add({
                ...order,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('Order saved:', newDoc.id);
            return { success: true, orderId: newDoc.id };
        } catch (error) {
            console.error('Save order error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all orders (admin only)
     */
    async getAllOrders() {
        try {
            if (!this.initialized) await this.initialize();
            if (!this.isAuthenticated()) throw new Error('User not authenticated');

            const snapshot = await this.db.collection('orders')
                .orderBy('createdAt', 'desc')
                .get();
            const orders = [];

            snapshot.forEach(doc => {
                orders.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return { success: true, orders };
        } catch (error) {
            console.error('Get orders error:', error);
            return { success: false, error: error.message, orders: [] };
        }
    }

    /**
     * Update order status
     */
    async updateOrderStatus(orderId, status) {
        try {
            if (!this.initialized) await this.initialize();
            if (!this.isAuthenticated()) throw new Error('User not authenticated');

            await this.db.collection('orders').doc(orderId).update({
                status: status,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('Order updated:', orderId);
            return { success: true };
        } catch (error) {
            console.error('Update order error:', error);
            return { success: false, error: error.message };
        }
    }

    // ============================================
    // SETTINGS METHODS
    // ============================================

    /**
     * Save settings to Firestore
     */
    async saveSettings(settings) {
        try {
            if (!this.initialized) await this.initialize();
            if (!this.isAuthenticated()) throw new Error('User not authenticated');

            await this.db.collection('settings').doc('global').set(settings, { merge: true });
            console.log('Settings saved');
            return { success: true };
        } catch (error) {
            console.error('Save settings error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get settings from Firestore
     */
    async getSettings() {
        try {
            if (!this.initialized) await this.initialize();

            const doc = await this.db.collection('settings').doc('global').get();
            if (doc.exists) {
                return { success: true, settings: doc.data() };
            } else {
                return { success: true, settings: {} };
            }
        } catch (error) {
            console.error('Get settings error:', error);
            return { success: false, error: error.message, settings: {} };
        }
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    /**
     * Backup all data to Firestore
     */
    async backupData(data) {
        try {
            if (!this.initialized) await this.initialize();
            if (!this.isAuthenticated()) throw new Error('User not authenticated');

            const timestamp = new Date().toISOString();
            await this.db.collection('backups').doc(timestamp).set({
                timestamp,
                products: data.products,
                orders: data.orders,
                settings: data.settings
            });

            console.log('Data backed up at:', timestamp);
            return { success: true };
        } catch (error) {
            console.error('Backup error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get backup history
     */
    async getBackupHistory() {
        try {
            if (!this.initialized) await this.initialize();
            if (!this.isAuthenticated()) throw new Error('User not authenticated');

            const snapshot = await this.db.collection('backups')
                .orderBy('timestamp', 'desc')
                .limit(10)
                .get();
            const backups = [];

            snapshot.forEach(doc => {
                backups.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return { success: true, backups };
        } catch (error) {
            console.error('Get backup history error:', error);
            return { success: false, error: error.message, backups: [] };
        }
    }

    /**
     * Clear all listeners
     */
    clearAllListeners() {
        this.productListeners.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
        this.productListeners = [];
    }

    /**
     * Get database statistics
     */
    async getStats() {
        try {
            if (!this.initialized) await this.initialize();

            const productsSnap = await this.db.collection('products').get();
            const ordersSnap = await this.db.collection('orders').get();

            return {
                success: true,
                totalProducts: productsSnap.size,
                totalOrders: ordersSnap.size
            };
        } catch (error) {
            console.error('Get stats error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Create global instance
const firebaseDB = new FirebaseDB();

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    firebaseDB.initialize();
});
