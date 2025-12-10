# Admin Dashboard Integration Guide

## 🎯 Quick Integration Steps

### Step 1: Add Dashboard Link to Main Website

Add this link in your main `index.html` navigation or footer:

```html
<a href="admin-dashboard.html" class="admin-link" style="display: none;">
    Admin Dashboard
</a>
```

Or add a keyboard shortcut to access it (e.g., Ctrl+Shift+A):

```javascript
// Add to your main.js or main website JavaScript
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
        window.location.href = 'admin-dashboard.html';
    }
});
```

### Step 2: Integrate Order Logging

When a user submits a contact form for a product, log it as an order:

**Before (Old Code)**:
```javascript
// In your modals.js or form handler
emailjs.send(serviceId, templateId, {
    customer_name: name,
    customer_email: email,
    product: productName,
    message: message
});
```

**After (New Code)**:
```javascript
// In your modals.js or form handler
emailjs.send(serviceId, templateId, {
    customer_name: name,
    customer_email: email,
    product: productName,
    message: message
}).then(() => {
    // Log order to admin dashboard
    if (typeof window.logOrderToAdmin === 'function') {
        window.logOrderToAdmin({
            customerName: name,
            email: email,
            phone: phone || '',
            product: productName,
            productId: productId,
            price: productPrice,
            message: message
        });
    }
});
```

### Step 3: Track Contact Clicks

When users click "Contact to Buy" or similar buttons:

```javascript
// Add to button click handler
document.getElementById('contactBtn').addEventListener('click', () => {
    // Track the click
    if (typeof window.trackContactClick === 'function') {
        window.trackContactClick({
            source: 'product-page',
            product: productName
        });
    }
    
    // Then open contact modal/form
    openContactModal();
});
```

### Step 4: Product Integration

If you dynamically add products, ensure they're saved to localStorage:

```javascript
// When adding a new product through admin dashboard
dashboard.products = [
    {
        id: 1,
        name: 'Django Web Development',
        category: 'courses',
        price: 55,
        image: 'image-url.jpg',
        shortDesc: 'Description',
        longDesc: 'Long description',
        createdAt: new Date().toISOString(),
        status: 'active'
    }
    // ... more products
];
dashboard.saveData();
```

To load products in your main website from the same localStorage:

```javascript
// In main.js or products.js
const dashboardProducts = JSON.parse(localStorage.getItem('munjizProducts'));
if (dashboardProducts) {
    // Use dashboard products in your store
    products = dashboardProducts;
}
```

## 📊 Real-World Example

### Complete Integration Example

```javascript
// ============================================
// INTEGRATION WITH CONTACT FORM
// ============================================

// When user submits "Contact to Buy" form
async function handleProductContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const name = formData.get('customerName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const productName = formData.get('productName');
    const productId = parseInt(formData.get('productId'));
    const productPrice = parseFloat(formData.get('productPrice'));
    const message = formData.get('message');
    
    try {
        // Send email
        await emailjs.send('service_hjaklhd', 'template_fhe6wgg', {
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            product: productName,
            price: productPrice,
            message: message,
            admin_email: 'hdiyan122@gmail.com'
        });
        
        // Log order to admin dashboard
        if (typeof window.logOrderToAdmin === 'function') {
            window.logOrderToAdmin({
                customerName: name,
                email: email,
                phone: phone,
                product: productName,
                productId: productId,
                price: productPrice,
                message: message
            });
        }
        
        // Show success message
        showAlert('Thank you! We will contact you soon.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showAlert('Failed to submit. Please try again.', 'error');
    }
}

// ============================================
// INTEGRATION WITH CONTACT BUTTON CLICKS
// ============================================

// Track when users click contact buttons
function setupContactTracking() {
    document.querySelectorAll('[data-contact-btn]').forEach(btn => {
        btn.addEventListener('click', () => {
            // Track the click
            if (typeof window.trackContactClick === 'function') {
                window.trackContactClick({
                    source: btn.dataset.source || 'unknown',
                    product: btn.dataset.product || 'unknown'
                });
            }
        });
    });
}

// ============================================
// LOAD PRODUCTS FROM DASHBOARD
// ============================================

// Load products from admin dashboard
function loadProductsFromDashboard() {
    const storedProducts = JSON.parse(localStorage.getItem('munjizProducts'));
    
    if (storedProducts && Array.isArray(storedProducts)) {
        // Filter to show only active products
        const activeProducts = storedProducts.filter(p => p.status === 'active');
        
        // Use in your store
        return activeProducts;
    }
    
    // Fallback to default products if none in dashboard
    return getDefaultProducts();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupContactTracking();
    
    // Load products from dashboard
    const products = loadProductsFromDashboard();
    
    // Render products in your store
    renderProducts(products);
});
```

## 🔗 Integration Checklist

- [ ] Dashboard files created (HTML, CSS, JS modules)
- [ ] Chart.js CDN included in dashboard HTML
- [ ] Order logging function called on form submit
- [ ] Click tracking function called on button click
- [ ] Products loaded from localStorage in main website
- [ ] Admin dashboard accessible (via link or shortcut)
- [ ] Tested order logging and tracking
- [ ] Settings configured (contact info, currencies, etc.)
- [ ] Theme toggle tested
- [ ] Responsive design verified on mobile

## 🧪 Testing the Integration

### Test 1: Create an Order

1. Go to main website
2. Click "Contact to Buy" on a product
3. Fill out and submit the form
4. Go to admin dashboard
5. Navigate to "Orders" section
6. Verify the new order appears

### Test 2: Track Clicks

1. Go to main website
2. Click on contact buttons multiple times
3. Go to admin dashboard
4. Navigate to "Analytics"
5. Check "Click Statistics" for updated numbers

### Test 3: Manage Products

1. Go to admin dashboard
2. Click "Products"
3. Add a new product
4. Go to main website
5. Refresh page
6. Verify new product appears (if you implemented product loading from dashboard)

### Test 4: Update Order Status

1. Go to admin dashboard
2. Navigate to "Orders"
3. Click "View" on an order
4. Change status and click "Update Status"
5. Verify status changes in the orders list

## 🚀 Deployment Notes

1. **Remove Debug Code**: Remove any console.log statements before deployment
2. **Verify URLs**: Ensure all image URLs are correct
3. **Test LocalStorage**: Verify localStorage works on your hosting
4. **HTTPS**: Use HTTPS in production for security
5. **Backup Data**: Periodically backup admin data
6. **Monitor Performance**: Check if dashboard gets slow with many orders

## 🔐 Security Recommendations

1. **Add Password Protection**: Implement login before deploying to production
2. **HTTPS Only**: Always use HTTPS to encrypt data in transit
3. **Server Storage**: Consider moving from localStorage to server database
4. **Access Control**: Implement role-based access (admin, staff, etc.)
5. **Audit Logs**: Keep track of who made what changes

## 📞 Troubleshooting Integration

### Orders Not Appearing

```javascript
// Debug: Check if function exists
console.log(typeof window.logOrderToAdmin); // Should be 'function'

// Debug: Call manually to test
window.logOrderToAdmin({
    customerName: 'Test',
    email: 'test@example.com',
    product: 'Test Product',
    productId: 1,
    price: 50,
    message: 'Test message'
});

// Check localStorage
console.log(JSON.parse(localStorage.getItem('munjizOrders')));
```

### Click Tracking Not Working

```javascript
// Debug: Check if function exists
console.log(typeof window.trackContactClick); // Should be 'function'

// Debug: Call manually
window.trackContactClick({ source: 'test' });

// Check localStorage
console.log(JSON.parse(localStorage.getItem('munjizClickStats')));
```

### Dashboard Not Loading

```javascript
// Check if dashboard script loaded
console.log(typeof AdminDashboard); // Should be 'function'
console.log(typeof dashboard); // Should be 'object'

// Check modules
console.log(typeof window.orderManagement); // Should be 'object'
console.log(typeof window.analyticsEngine); // Should be 'object'
console.log(typeof window.settingsManager); // Should be 'object'
```

## 📊 Sample Integration Script

If you want a ready-to-use integration file, save this as `dashboard-integration.js` and include it in your main website:

```javascript
// ============================================
// DASHBOARD INTEGRATION HELPER
// ============================================

class DashboardIntegration {
    // Initialize integration
    static init() {
        window.logOrderToAdmin = DashboardIntegration.logOrder;
        window.trackContactClick = DashboardIntegration.trackClick;
        window.loadProductsFromDashboard = DashboardIntegration.loadProducts;
    }

    // Log order to dashboard
    static logOrder(orderData) {
        try {
            const orders = JSON.parse(localStorage.getItem('munjizOrders')) || [];
            
            const newOrder = {
                id: Math.floor(Date.now() / 1000),
                customerName: orderData.customerName || '',
                email: orderData.email || '',
                phone: orderData.phone || '',
                product: orderData.product || '',
                productId: orderData.productId || null,
                price: orderData.price || null,
                message: orderData.message || '',
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            
            orders.push(newOrder);
            localStorage.setItem('munjizOrders', JSON.stringify(orders));
            
            console.log('Order logged successfully:', newOrder);
            return newOrder;
        } catch (error) {
            console.error('Failed to log order:', error);
        }
    }

    // Track contact clicks
    static trackClick(details = {}) {
        try {
            const stats = JSON.parse(localStorage.getItem('munjizClickStats')) || 
                         { total: 0, history: [] };
            
            stats.history.push(new Date().toISOString());
            stats.total = stats.history.length;
            
            localStorage.setItem('munjizClickStats', JSON.stringify(stats));
            
            console.log('Click tracked:', stats.total);
        } catch (error) {
            console.error('Failed to track click:', error);
        }
    }

    // Load products from dashboard
    static loadProducts() {
        try {
            const products = JSON.parse(localStorage.getItem('munjizProducts'));
            if (products && Array.isArray(products)) {
                return products.filter(p => p.status === 'active');
            }
        } catch (error) {
            console.error('Failed to load products:', error);
        }
        return [];
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        DashboardIntegration.init();
    });
} else {
    DashboardIntegration.init();
}
```

Then include it in your HTML:

```html
<script src="dashboard-integration.js"></script>
```

## ✅ Verification Checklist

After integration, verify:

- [ ] All 4 JavaScript files are loaded (admin-dashboard.js, order-management.js, analytics.js, settings.js)
- [ ] Orders appear in dashboard when submitted from main website
- [ ] Click statistics update when contact buttons are clicked
- [ ] Products can be managed from dashboard
- [ ] Order statuses can be updated
- [ ] Analytics show correct data
- [ ] Settings can be modified and persist
- [ ] Theme toggle works
- [ ] Dashboard is responsive on mobile devices
- [ ] No JavaScript errors in browser console

---

**Need Help?** Check ADMIN-DASHBOARD-GUIDE.md for detailed documentation.
