# Admin Dashboard - Complete Documentation

## 🎯 Overview

The Munjiz Admin Dashboard is a comprehensive management system for handling products, orders, analytics, and settings. It provides a modern, responsive interface for administrators to manage the entire store infrastructure.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Features](#features)
3. [File Structure](#file-structure)
4. [Usage Guide](#usage-guide)
5. [API Reference](#api-reference)
6. [Integration Guide](#integration-guide)
7. [Data Management](#data-management)
8. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Access the Dashboard

1. Open `admin-dashboard.html` in your browser
2. You'll see the login/dashboard interface
3. Navigate using the sidebar menu

### File Structure

```
/
├── admin-dashboard.html       # Main dashboard interface
├── admin-dashboard.css        # Dashboard styling
├── admin-dashboard.js         # Core dashboard logic
├── order-management.js        # Order handling module
├── analytics.js               # Analytics engine
├── settings.js                # Settings management
└── ADMIN-DASHBOARD-GUIDE.md  # This file
```

## ✨ Features

### 1. Dashboard Overview
- **Quick Stats**: Total orders, products, clicks, pending orders
- **Weekly Chart**: Visual representation of orders per day
- **Top Products**: Best-performing products
- Real-time data updates

### 2. Product Management
- **Add Products**: Create new products with details
- **Edit Products**: Modify existing product information
- **Delete Products**: Remove unwanted products
- **Hide/Show**: Toggle product visibility on the store
- **Table View**: Sortable product list with status indicators

**Product Fields**:
- Name
- Category (Course, PDF/E-book, Service, AI Tool)
- Price (USD)
- Image URL
- Short Description
- Long Description
- Status (Active/Hidden)
- Created Date

### 3. Order Management
- **View All Orders**: Complete list of customer inquiries
- **Order Details**: Full order information and messages
- **Status Tracking**: Pending → Processing → Completed
- **Filter Orders**: By status (pending, processing, completed)
- **Order Information**:
  - Customer name, email, phone
  - Product ordered
  - Price
  - Message
  - Date & time
  - Current status

### 4. Analytics
- **Orders by Period**: Daily, weekly, monthly order counts
- **Popular Products**: Top-selling products with order counts
- **Click Statistics**: Track contact button clicks
  - Total clicks
  - Today's clicks
  - This week's clicks
  - This month's clicks
- **Category Distribution**: Pie chart of product categories
- **Revenue Analytics**: Coming soon

### 5. Settings Management

#### Contact Information
- Email
- WhatsApp number
- PayPal account
- Instagram handle

#### Currency Settings
- Default currency (USD, EUR, MAD)
- Available currencies
- Exchange rates

#### Language Settings
- Default language (English, Arabic, French)
- Available languages
- RTL support for Arabic

#### Theme Settings
- Dark mode (default)
- Light mode toggle

## 📖 Usage Guide

### Dashboard Section

**Accessing**: Click "Dashboard" in the sidebar

**Features**:
- View key metrics at a glance
- See weekly order trends
- Identify top-performing products
- Monitor order status distribution

### Product Management

**Adding a Product**:
1. Click "Add Product" button
2. Fill in product details:
   - Product name
   - Category
   - Price in USD
   - Image URL
   - Descriptions (short and long)
3. Click "Save Product"

**Editing a Product**:
1. Find the product in the table
2. Click "Edit" button
3. Modify the information
4. Click "Save Product"

**Hiding/Showing Products**:
1. Click "Hide" to remove from public store
2. Click "Show" to make visible again
3. Use status column to check current visibility

**Deleting a Product**:
1. Click "Delete" button
2. Confirm deletion
3. Product is permanently removed

### Order Management

**Viewing Orders**:
1. Click "Orders" in sidebar
2. All orders appear in table
3. Filter by status if needed

**Viewing Order Details**:
1. Click "View" button next to an order
2. Modal opens with full details
3. See customer information, message, and product

**Updating Order Status**:
1. Click "Mark" button on an order
2. Select new status (Pending, Processing, Completed)
3. Click "Update Status"
4. Status is saved immediately

### Analytics

**Daily/Weekly/Monthly View**:
1. Click "Analytics" in sidebar
2. Click period tabs (Daily, Weekly, Monthly)
3. Chart updates automatically

**Popular Products**:
- Shows products ranked by order count
- Includes product name and order count

**Click Statistics**:
- Total clicks across all time
- Breaks down by day, week, month

### Settings

**Contact Information**:
1. Click "Settings" in sidebar
2. Fill in contact details
3. Click "Save Changes"

**Currency Settings**:
1. Select default currency
2. Check/uncheck available currencies
3. Save changes

**Language Settings**:
1. Select default language
2. Choose available languages
3. Save changes

**Theme Settings**:
1. Select Dark Mode or Light Mode
2. Save changes
3. Theme applies immediately

## 🔌 API Reference

### Dashboard Class

```javascript
// Create dashboard instance
const dashboard = new AdminDashboard();

// Access dashboard data
dashboard.products      // Array of products
dashboard.orders        // Array of orders
dashboard.clickStats    // Click statistics

// Render sections
dashboard.renderDashboard();
dashboard.renderProducts();
dashboard.renderOrders();
dashboard.renderAnalytics();
dashboard.renderSettings();

// Product operations
dashboard.renderProducts();           // Render product table
dashboard.openProductModal(id);       // Open edit modal
dashboard.closeProductModal();        // Close modal
dashboard.editProduct(id);            // Edit product
dashboard.deleteProduct(id);          // Delete product
dashboard.toggleProductVisibility(id);// Toggle visibility

// Order operations
dashboard.renderOrders();             // Render orders table
dashboard.viewOrder(id);              // View order details
dashboard.updateOrderStatus(id);      // Update status
dashboard.closeOrderModal();          // Close modal

// Utilities
dashboard.saveData();                 // Save to localStorage
dashboard.loadData();                 // Load from localStorage
dashboard.showNotification(message);  // Show notification
dashboard.toggleTheme();              // Toggle light/dark mode
```

### Order Management Class

```javascript
// Get order management instance
const orderMgmt = window.orderManagement;

// CRUD operations
orderMgmt.addOrder(orderData);           // Add new order
orderMgmt.updateOrder(id, updates);      // Update order
orderMgmt.deleteOrder(id);               // Delete order
orderMgmt.getOrder(id);                  // Get specific order
orderMgmt.getAllOrders(filter);          // Get filtered orders

// Status management
orderMgmt.updateOrderStatus(id, status); // Update status
orderMgmt.markAsPending(id);             // Mark pending
orderMgmt.markAsProcessing(id);          // Mark processing
orderMgmt.markAsCompleted(id);           // Mark completed

// Analytics
orderMgmt.getOrderStats();               // Get statistics
orderMgmt.getOrdersByProduct(id);        // Get product orders
orderMgmt.getOrdersPerDay(days);         // Daily breakdown
orderMgmt.getOrdersPerWeek(weeks);       // Weekly breakdown
orderMgmt.getOrdersPerMonth(months);     // Monthly breakdown

// Export
orderMgmt.exportOrdersAsCSV();           // Export as CSV string
orderMgmt.downloadOrdersAsCSV();         // Download CSV file
```

### Analytics Class

```javascript
// Get analytics instance
const analytics = window.analyticsEngine;

// Comprehensive analytics
analytics.getOrderAnalytics();           // Order stats
analytics.getProductAnalytics();         // Product stats
analytics.getCustomerAnalytics();        // Customer stats
analytics.getClickAnalytics();           // Click stats
analytics.getRevenueAnalytics();         // Revenue stats

// Specific metrics
analytics.getTotalRevenue();             // Total revenue
analytics.getAverageOrderValue();        // Average order value
analytics.getOrdersByStatus();           // Orders by status
analytics.getTopSellingProducts();       // Top products
analytics.getTotalUniqueCustomers();     // Unique customers

// Trends
analytics.getOrderTrends();              // Order trends
analytics.getRevenueTrends();            // Revenue trends
analytics.getClicksByDay(days);          // Daily clicks
analytics.getClicksByWeek(weeks);        // Weekly clicks

// Reports
analytics.generateComprehensiveReport(); // Full report
analytics.generateSummaryReport();       // Summary report
analytics.exportReportAsJSON();          // Export as JSON
analytics.downloadReportAsJSON();        // Download JSON file
```

### Settings Manager Class

```javascript
// Get settings instance
const settings = window.settingsManager;

// Contact settings
settings.getContactSettings();           // Get all contact info
settings.updateContactSettings(contact);// Update contact info

// Currency settings
settings.getCurrencySettings();          // Get currency settings
settings.getDefaultCurrency();           // Get default currency
settings.setDefaultCurrency(code);       // Set default currency
settings.convertCurrency(amount, from, to); // Convert currency
settings.updateExchangeRate(code, rate); // Update exchange rate

// Language settings
settings.getLanguageSettings();          // Get language settings
settings.getDefaultLanguage();           // Get default language
settings.setDefaultLanguage(code);       // Set default language
settings.isRTL(code);                    // Check if RTL language

// Theme settings
settings.getThemeSettings();             // Get theme settings
settings.getDefaultTheme();              // Get default theme
settings.setDefaultTheme(theme);         // Set default theme
settings.applyTheme(theme);              // Apply theme

// General
settings.getAllSettings();               // Get all settings
settings.exportSettings();               // Export as JSON
settings.importSettings(data);           // Import settings
settings.resetToDefaults();              // Reset to defaults
settings.downloadSettingsBackup();       // Download backup
```

## 🔗 Integration Guide

### Integration with Main Website

**Step 1: Add tracking to contact forms**

```javascript
// When a form is submitted, call this:
window.logOrderToAdmin({
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    product: 'Django Web Development',
    productId: 1,
    price: 55,
    message: 'I am interested in this course'
});
```

**Step 2: Track contact button clicks**

```javascript
// When contact button is clicked:
window.trackContactClick({
    source: 'product-page',
    product: 'Django Web Development'
});
```

**Step 3: Initialize EmailJS integration**

```javascript
// In your main website, make sure EmailJS is initialized:
emailjs.init({ publicKey: 'FpbbU5jLTD80qCWLz' });

// After sending an order email:
window.logOrderToAdmin(orderData);
```

### Data Structure Examples

**Order Data**:
```javascript
{
    id: 1234567890,
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    product: 'Django Web Development',
    productId: 1,
    price: 55,
    message: 'Interest inquiry message',
    status: 'pending', // pending, processing, completed
    createdAt: '2024-01-15T10:30:00Z',
    emailSent: true
}
```

**Product Data**:
```javascript
{
    id: 1,
    name: 'Django Web Development',
    category: 'courses',
    price: 55,
    image: 'https://example.com/image.jpg',
    shortDesc: 'Master Django framework',
    longDesc: 'Complete course covering...',
    createdAt: '2024-01-01T00:00:00Z',
    status: 'active' // active, hidden
}
```

## 💾 Data Management

### LocalStorage Keys

The dashboard uses the following localStorage keys:

- `munjizProducts`: Array of all products
- `munjizOrders`: Array of all orders
- `munjizClickStats`: Click statistics
- `munjizSettings`: Admin settings

### Data Persistence

All data is automatically saved to localStorage whenever changes are made. Data persists across browser sessions.

### Data Backup

**Export Data**:
```javascript
// Export products
const products = JSON.stringify(dashboard.products);

// Export orders
const orders = JSON.stringify(dashboard.orders);

// Export settings
const settings = window.settingsManager.exportSettings();
```

**Import Data**:
```javascript
// Import products
dashboard.products = JSON.parse(productsJSON);
dashboard.saveData();

// Import settings
window.settingsManager.importSettings(JSON.parse(settingsJSON));
```

## 🐛 Troubleshooting

### Data Not Saving

**Problem**: Changes disappear after refresh

**Solutions**:
1. Check browser's localStorage is enabled
2. Check browser storage limits (usually 5-10MB)
3. Clear browser cache and try again
4. Use incognito/private window to test

### Dashboard Not Loading

**Problem**: Blank page or errors in console

**Solutions**:
1. Check all JavaScript files are loaded:
   - admin-dashboard.js
   - order-management.js
   - analytics.js
   - settings.js
2. Check Chart.js CDN is accessible
3. Open browser console (F12) to see specific errors
4. Check for CORS issues if running from different domain

### Orders Not Logging

**Problem**: Orders submitted but not appearing in dashboard

**Solutions**:
1. Verify `window.logOrderToAdmin()` is being called
2. Check order data is valid
3. Open browser console to see if there are errors
4. Verify localStorage has space available
5. Try exporting and clearing storage

### Currency Conversion Issues

**Problem**: Currency conversion gives wrong values

**Solutions**:
1. Check exchange rates in Settings
2. Update rates: Settings → Currency Settings → Edit Exchange Rates
3. Verify source and target currencies are available
4. Use `settings.updateExchangeRate(code, rate)` to fix rates

### Performance Issues

**Problem**: Dashboard is slow or sluggish

**Solutions**:
1. Check number of orders in localStorage (should be < 10,000)
2. Archive old orders periodically
3. Clear browser cache
4. Check system RAM usage
5. Use Chrome DevTools to profile performance

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the API reference
3. Check browser console (F12) for error messages
4. Verify all files are properly created and loaded

## 🔐 Security Notes

1. **Password Protection**: Dashboard currently has no login. Add authentication before production use.
2. **Data Sensitivity**: LocalStorage is not encrypted. Use HTTPS and consider server-side storage.
3. **Email Credentials**: EmailJS public key is visible in code (this is intended, not a security risk).
4. **Admin Access**: Restrict physical access to admin dashboard or implement role-based access control.

## 🚀 Future Enhancements

1. Admin login with password
2. Server-side database integration
3. Advanced analytics dashboards
4. Email notification system
5. CSV/PDF export functionality
6. Customer messaging system
7. Bulk operations (delete, edit multiple)
8. Activity logging and audit trail

## 📝 Version History

- **v1.0** (Current): Initial release with dashboard, products, orders, analytics, and settings

---

**Last Updated**: 2024
**Created for**: Munjiz - Professional Web & Digital Services
