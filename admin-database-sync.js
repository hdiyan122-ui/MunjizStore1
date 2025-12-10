/**
 * Admin Dashboard Database Sync Module
 * Handles synchronization between admin dashboard and Firebase database
 */

class AdminDatabaseSync {
    constructor() {
        this.isSyncing = false;
        this.syncQueue = [];
    }

    /**
     * Save products to database (Firebase or localStorage)
     */
    async saveProductsToDatabase(products) {
        if (this.isSyncing) {
            this.syncQueue.push(products);
            return;
        }

        this.isSyncing = true;

        try {
            if (typeof firebase !== 'undefined' && firebase.database) {
                // Save to Firebase
                const ref = firebase.database().ref('products');
                const productsObj = {};
                
                products.forEach(p => {
                    // Convert admin format to database format
                    productsObj[p.id.toString()] = {
                        id: p.id.toString(),
                        name: p.name,
                        title: p.name, // For compatibility
                        category: p.category,
                        price: p.price,
                        description: p.longDesc || p.shortDesc,
                        image: p.image,
                        featured: p.featured || false,
                        popular: p.popular || false,
                        created: p.createdAt,
                        status: p.status
                    };
                });

                await ref.set(productsObj);
                console.log('✓ Products synced to Firebase');
                
                // Notify the website to update
                this.notifyWebsiteUpdate();
            } else {
                // Fallback to localStorage
                localStorage.setItem('munjizProducts', JSON.stringify(products));
                console.log('✓ Products saved to localStorage');
            }
        } catch (error) {
            console.error('Error syncing products:', error);
            // Fallback to localStorage
            localStorage.setItem('munjizProducts', JSON.stringify(products));
        }

        this.isSyncing = false;

        // Process queue if there are pending syncs
        if (this.syncQueue.length > 0) {
            const queuedProducts = this.syncQueue.pop();
            this.saveProductsToDatabase(queuedProducts);
        }
    }

    /**
     * Save single product to database
     */
    async saveProductToDatabase(product) {
        try {
            if (typeof firebase !== 'undefined' && firebase.database) {
                // Convert to database format
                const dbProduct = {
                    id: product.id.toString(),
                    name: product.name,
                    title: product.name,
                    category: product.category,
                    price: product.price,
                    description: product.longDesc || product.shortDesc,
                    image: product.image,
                    featured: product.featured || false,
                    popular: product.popular || false,
                    created: product.createdAt,
                    status: product.status
                };

                const ref = firebase.database().ref(`products/${product.id}`);
                await ref.set(dbProduct);
                console.log('✓ Product synced to Firebase:', product.name);
            }
        } catch (error) {
            console.error('Error saving product:', error);
        }
    }

    /**
     * Delete product from database
     */
    async deleteProductFromDatabase(productId) {
        try {
            if (typeof firebase !== 'undefined' && firebase.database) {
                const ref = firebase.database().ref(`products/${productId}`);
                await ref.remove();
                console.log('✓ Product deleted from Firebase');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    /**
     * Load products from database
     */
    async loadProductsFromDatabase() {
        try {
            if (typeof firebase !== 'undefined' && firebase.database) {
                const ref = firebase.database().ref('products');
                const snapshot = await ref.once('value');
                const data = snapshot.val();

                if (data) {
                    return Object.values(data).map(p => ({
                        id: parseInt(p.id),
                        name: p.name || p.title,
                        category: p.category,
                        price: p.price,
                        image: p.image,
                        shortDesc: p.description ? p.description.substring(0, 100) : '',
                        longDesc: p.description || '',
                        createdAt: p.created,
                        status: p.status || 'active',
                        featured: p.featured || false,
                        popular: p.popular || false
                    }));
                }
            }
        } catch (error) {
            console.error('Error loading products from database:', error);
        }

        return null;
    }

    /**
     * Notify website to update products
     * This broadcasts a message to update the product list
     */
    notifyWebsiteUpdate() {
        try {
            // Dispatch custom event for other tabs/windows
            if (typeof BroadcastChannel !== 'undefined') {
                const channel = new BroadcastChannel('munjiz-products-update');
                channel.postMessage({ type: 'products-updated', timestamp: Date.now() });
                channel.close();
            }

            // Dispatch local event
            window.dispatchEvent(new CustomEvent('munjiz-products-updated', {
                detail: { timestamp: Date.now() }
            }));

            console.log('✓ Website update notification sent');
        } catch (error) {
            console.error('Error notifying website:', error);
        }
    }

    /**
     * Setup real-time listener for products
     */
    setupRealtimeListener(callback) {
        try {
            if (typeof firebase !== 'undefined' && firebase.database) {
                const ref = firebase.database().ref('products');
                ref.on('value', (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const products = Object.values(data).map(p => ({
                            id: parseInt(p.id),
                            name: p.name || p.title,
                            category: p.category,
                            price: p.price,
                            image: p.image,
                            shortDesc: p.description ? p.description.substring(0, 100) : '',
                            longDesc: p.description || '',
                            createdAt: p.created,
                            status: p.status || 'active',
                            featured: p.featured || false,
                            popular: p.popular || false
                        }));
                        
                        if (callback) {
                            callback(products);
                        }
                    }
                });
                console.log('✓ Real-time listener setup');
            }
        } catch (error) {
            console.error('Error setting up real-time listener:', error);
        }
    }
}

// Initialize global instance
const adminDatabaseSync = new AdminDatabaseSync();

// Export if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdminDatabaseSync, adminDatabaseSync };
}
