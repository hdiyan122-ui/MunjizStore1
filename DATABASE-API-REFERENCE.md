# Database API Reference

## Overview
Complete API documentation for database operations in the new Firebase-integrated system.

---

## DatabaseManager API

**Located in**: `firebase-config.js`
**Usage**: Access via global variable `window.dbManager`

### Methods

#### `getAllProducts()`
Returns all products from the database.

```javascript
const products = dbManager.getAllProducts();
// Returns: Array of product objects
// Example:
[
  { id: '1', name: 'Django Course', category: 'courses', price: 55 },
  { id: '2', name: 'WhatsApp Bot', category: 'ai-tools', price: 155 }
]
```

#### `getProductsByCategory(category)`
Returns products filtered by category.

```javascript
const courses = dbManager.getProductsByCategory('courses');
const services = dbManager.getProductsByCategory('services');
// Returns: Array of products in that category
```

**Valid Categories**:
- `'courses'`
- `'ebooks'`
- `'ai-tools'`
- `'services'`

#### `searchProducts(query)`
Search products by name or description.

```javascript
const results = dbManager.searchProducts('Django');
// Returns: Array of matching products
```

#### `async addProduct(product)`
Add a new product to the database.

```javascript
const newProduct = await dbManager.addProduct({
    name: 'Python Masterclass',
    category: 'courses',
    price: 199,
    image: 'https://...',
    description: 'Complete Python training'
});
// Returns: Created product with ID
```

**Product Object Required Fields**:
- `name` (string) - Product name
- `category` (string) - One of valid categories
- `price` (number) - Product price
- `description` (string) - Product description
- `image` (string, optional) - Image URL

#### `async updateProduct(productId, updates)`
Update an existing product.

```javascript
const updated = await dbManager.updateProduct('1', {
    price: 249,
    description: 'Updated description'
});
// Returns: Updated product object
```

#### `async deleteProduct(productId)`
Delete a product from the database.

```javascript
const success = await dbManager.deleteProduct('1');
// Returns: true if successful, false otherwise
```

---

## ProductManager API

**Located in**: `products.js`
**Usage**: Access via global variable `window.productManager`

### Methods

#### `getAllProducts()`
Get all products (unfiltered).

```javascript
const allProducts = productManager.getAllProducts();
// Returns: Array of all products with website-specific format
```

#### `getFilteredProducts()`
Get products after applying current filters.

```javascript
const filtered = productManager.getFilteredProducts();
// Returns: Array of products matching current filters
```

#### `getProductById(id)`
Get a single product by ID.

```javascript
const product = productManager.getProductById(1);
// Returns: Product object or undefined
```

#### `getFeaturedProducts()`
Get all featured products.

```javascript
const featured = productManager.getFeaturedProducts();
// Returns: Array of products with featured=true
```

#### `setFilters(filters)`
Apply filters to products.

```javascript
productManager.setFilters({
    category: 'courses',
    minPrice: 50,
    maxPrice: 500,
    search: 'Python',
    sortBy: 'price-low'
});
// Immediately applies filters and updates grid

// Reset filters
productManager.setFilters({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    search: ''
});
```

**Filter Options**:
- `category` (string) - Category ID or empty string for all
- `minPrice` (number) - Minimum product price (default: 0)
- `maxPrice` (number) - Maximum product price (default: 1000)
- `search` (string) - Search query or empty string
- `sortBy` (string) - Sort order: `'newest'|'popular'|'price-low'|'price-high'`

#### `resetFilters()`
Clear all active filters.

```javascript
productManager.resetFilters();
// Resets to default: no category, price 0-1000, no search, newest sort
```

#### `toggleFavorite(productId)`
Add/remove product from favorites.

```javascript
productManager.toggleFavorite(1);
// If product is favorite, removes it
// If not favorite, adds it
```

#### `isFavorite(productId)`
Check if product is in favorites.

```javascript
const isFav = productManager.isFavorite(1);
// Returns: true if product is favorited, false otherwise
```

#### `updateProductsFromDatabase(databaseProducts)`
Update manager with new products from database. **Called automatically on database changes.**

```javascript
productManager.updateProductsFromDatabase(dbProducts);
// Converts database format to website format
// Updates all products
// Re-renders product grid
```

---

## AdminDatabaseSync API

**Located in**: `admin-database-sync.js`
**Usage**: Access via global variable `window.adminDatabaseSync`

### Methods

#### `async saveProductsToDatabase(products)`
Save all products to database (Firebase or localStorage).

```javascript
await adminDatabaseSync.saveProductsToDatabase([
    { id: 1, name: 'Course 1', price: 99 },
    { id: 2, name: 'Course 2', price: 199 }
]);
// Logs: "✓ Products synced to Firebase"
// Falls back to localStorage if Firebase unavailable
```

**Note**: Called automatically by admin dashboard `saveData()`

#### `async saveProductToDatabase(product)`
Save single product to database.

```javascript
const product = {
    id: 1,
    name: 'Single Product',
    category: 'courses',
    price: 99,
    // ... other fields
};
await adminDatabaseSync.saveProductToDatabase(product);
// Logs: "✓ Product synced to Firebase: Single Product"
```

#### `async deleteProductFromDatabase(productId)`
Delete product from database.

```javascript
await adminDatabaseSync.deleteProductFromDatabase(1);
// Logs: "✓ Product deleted from Firebase"
```

#### `notifyWebsiteUpdate()`
Broadcast notification that products changed. **Called automatically after saves.**

```javascript
adminDatabaseSync.notifyWebsiteUpdate();
// Triggers custom event 'munjiz-products-updated'
// Notifies other browser tabs/windows
// Website re-renders products if listening
```

#### `async loadProductsFromDatabase()`
Load all products from database.

```javascript
const products = await adminDatabaseSync.loadProductsFromDatabase();
// Returns: Array of products from Firebase
// Or: null if not available
```

#### `setupRealtimeListener(callback)`
Setup real-time listener for product changes.

```javascript
adminDatabaseSync.setupRealtimeListener((products) => {
    console.log('Products updated:', products);
    // Called whenever any product changes in database
    // Automatic in current implementation
});
```

---

## Product Object Format Reference

### Database Format (Firebase)
```javascript
{
    id: "1",                    // String ID
    name: "Django Course",      // Product name
    title: "Django Course",     // Alias for name
    category: "courses",        // Category ID
    price: 55,                  // Number price
    description: "Learn Django", // Full description
    image: "https://...",       // Image URL
    featured: true,             // Boolean
    popular: false,             // Boolean
    created: "2024-01-15T10:30:00Z", // ISO timestamp
    status: "active"            // Status: "active" or "hidden"
}
```

### Website Format (ProductManager)
```javascript
{
    id: 1,                           // Number ID
    title: 'product_django_title',  // i18n translation key
    description: 'product_django_desc', // i18n translation key
    price: 55,                       // Number price
    category: 'courses',             // Category ID
    icon: '📚',                      // Emoji icon
    featured: true,                  // Boolean
    popular: false,                  // Boolean
    created: Date object             // JavaScript Date
}
```

### Admin Dashboard Format (localStorage)
```javascript
{
    id: 1,                                  // Number ID
    name: "Django Web Development",         // Product name
    category: "courses",                    // Category ID
    price: 55,                              // Number price
    image: "https://via.placeholder.com/...", // Image URL
    shortDesc: "Master Django framework",   // Short description
    longDesc: "Complete Django course...",  // Long description
    createdAt: "2024-01-15T10:30:00Z",     // ISO timestamp
    status: "active"                        // Status
}
```

---

## Events

### Custom Events Dispatched

#### `munjiz-products-updated`
Fired when products are updated in database.

```javascript
window.addEventListener('munjiz-products-updated', (event) => {
    console.log('Products updated at:', event.detail.timestamp);
    // Triggered when admin saves products
    // Website can listen to auto-update
});
```

#### `change` (on ProductManager filters)
Fired when filters change and products are re-rendered.

```javascript
// Internally handled, updates product grid automatically
```

---

## Global Variables

```javascript
// Database Manager
window.dbManager              // Instance of DatabaseManager
window.firebaseInitialized    // Boolean, Firebase initialized?
window.database              // Firebase database reference

// Product Manager (Website)
window.productManager        // Instance of ProductManager
window.productsData         // Array of product data (dynamically loaded)
window.categories           // Array of category definitions

// Admin Sync
window.adminDatabaseSync    // Instance of AdminDatabaseSync

// Utilities
window.i18n                 // Internationalization manager
window.currencyManager      // Currency conversion manager
```

---

## Common Usage Examples

### Example 1: Add Product From Code
```javascript
const newProduct = await dbManager.addProduct({
    name: 'Advanced JavaScript',
    category: 'courses',
    price: 299,
    image: 'https://...',
    description: 'Master async, promises, and more'
});
console.log('Product added:', newProduct.id);
```

### Example 2: Filter and Display
```javascript
// User clicks category
productManager.setFilters({ category: 'courses' });
// Grid automatically updates
renderProductsGrid('productsGrid');
```

### Example 3: Search Products
```javascript
const searchResults = dbManager.searchProducts('Python');
console.log(`Found ${searchResults.length} products`);

// Or via ProductManager
productManager.setFilters({ search: 'Python' });
const filtered = productManager.getFilteredProducts();
```

### Example 4: Listen to Product Updates
```javascript
window.addEventListener('munjiz-products-updated', () => {
    console.log('Products changed, refreshing...');
    location.reload(); // Or update UI without reload
});
```

### Example 5: Get All Products by Category
```javascript
const allCourses = dbManager.getProductsByCategory('courses');
console.log(`Total courses: ${allCourses.length}`);

allCourses.forEach(course => {
    console.log(`${course.name}: $${course.price}`);
});
```

### Example 6: Admin Dashboard Product Save
```javascript
// This happens automatically in admin-dashboard.js
// But here's the flow:

const product = {
    id: 99,
    name: 'New Course',
    category: 'courses',
    price: 199,
    // ...
};

// Admin saves
dashboard.saveData(); 
// → Calls saveData() which:
// → Saves to localStorage
// → Calls adminDatabaseSync.saveProductsToDatabase()
// → Updates Firebase
// → Notifies website via custom event
```

---

## Error Handling

### Try-Catch Pattern
```javascript
try {
    const product = await dbManager.addProduct(productData);
    console.log('Success:', product);
} catch (error) {
    console.error('Failed to add product:', error);
    // Falls back to localStorage automatically
}
```

### Checking Firebase Status
```javascript
if (window.firebaseInitialized) {
    console.log('Firebase is connected');
} else {
    console.log('Using localStorage backup');
}
```

### Database Available Check
```javascript
if (window.database) {
    // Firebase database available
    // Can use real-time features
} else {
    // Fallback to localStorage
    // Still fully functional
}
```

---

## Performance Tips

### Batch Operations
```javascript
// Good: Batch updates
const products = [
    { name: 'Product 1', price: 99 },
    { name: 'Product 2', price: 199 }
];
await adminDatabaseSync.saveProductsToDatabase(products);

// Bad: Individual updates (slower)
await dbManager.addProduct(products[0]);
await dbManager.addProduct(products[1]);
```

### Cache Products
```javascript
// Products cached in memory
const cached = productManager.getAllProducts();
// Fast! No database call

// But for latest data:
// Wait for auto-sync or manually sync
```

### Debounce Searches
```javascript
// Already implemented in products.js
// 300ms delay before filtering
// Prevents lag on fast typing
```

---

## Migration & Backup

### Export All Products
```javascript
const allProducts = dbManager.getAllProducts();
const json = JSON.stringify(allProducts, null, 2);
console.log(json);
// Copy and save to file
```

### Import Products
```javascript
const imported = JSON.parse(jsonData);
await adminDatabaseSync.saveProductsToDatabase(imported);
// All products restored
```

### Backup to File
```javascript
const backup = {
    products: dbManager.getAllProducts(),
    timestamp: new Date().toISOString()
};
const blob = new Blob([JSON.stringify(backup)], {type: 'application/json'});
// Download blob as backup.json
```

---

## Debugging

### Enable Detailed Logging
```javascript
// All operations log to console automatically
// Check browser console (F12) for:
// ✓ "Products updated from database: X items"
// ✓ "Products synced to Firebase"
// etc.
```

### Check Product Data Structure
```javascript
const products = productManager.getAllProducts();
console.table(products);
// View products in table format in console
```

### Monitor Real-Time Updates
```javascript
window.addEventListener('munjiz-products-updated', (e) => {
    console.log('Update detected at:', new Date(e.detail.timestamp));
    const latest = productManager.getAllProducts();
    console.log('Current product count:', latest.length);
});
```

---

## Limitations & Constraints

### Free Tier Limits (Firebase)
- Max 100 concurrent connections
- Max 1 GB storage
- Max 1 MB per operation
- No automatic backups

### LocalStorage Limits
- Max 5-10 MB per domain
- Persists until manually cleared
- Not shared across domains

### Search Limitations
- Case-insensitive by default
- Searches name and description only
- No full-text search indexing

---

## Version History

- **v1.0** (Current): Firebase Realtime Database integration
- **v0.9**: Admin dashboard with localStorage
- **v0.8**: Basic products.js with hardcoded data

---

## Support & Documentation

- Main Guide: `DATABASE-IMPLEMENTATION-GUIDE.md`
- Quick Start: `QUICK-START-GUIDE.md`
- This File: `DATABASE-API-REFERENCE.md`

**All systems fully documented and ready to use!** 🚀
