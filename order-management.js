// ============================================
// ORDER MANAGEMENT MODULE
// ============================================

class OrderManagement {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.init();
    }

    init() {
        this.setupOrderIntegration();
    }

    // ============================================
    // ORDER INTEGRATION WITH EMAILJS
    // ============================================

    setupOrderIntegration() {
        // Listen for orders submitted through contact forms
        this.setupFormListeners();
    }

    setupFormListeners() {
        // This will be called from the main website to log orders
        window.logOrderToAdmin = (orderData) => {
            this.addOrder(orderData);
        };
    }

    // ============================================
    // ORDER CRUD OPERATIONS
    // ============================================

    addOrder(orderData) {
        const order = {
            id: this.generateOrderId(),
            customerName: orderData.customerName || '',
            email: orderData.email || '',
            phone: orderData.phone || '',
            product: orderData.product || '',
            productId: orderData.productId || null,
            price: orderData.price || null,
            message: orderData.message || '',
            status: 'pending',
            createdAt: new Date().toISOString(),
            emailSent: orderData.emailSent || false
        };

        this.dashboard.orders.push(order);
        this.dashboard.saveData();
        
        return order;
    }

    updateOrder(orderId, updates) {
        const order = this.dashboard.orders.find(o => o.id === orderId);
        if (order) {
            Object.assign(order, updates);
            this.dashboard.saveData();
            return order;
        }
        return null;
    }

    deleteOrder(orderId) {
        this.dashboard.orders = this.dashboard.orders.filter(o => o.id !== orderId);
        this.dashboard.saveData();
    }

    getOrder(orderId) {
        return this.dashboard.orders.find(o => o.id === orderId);
    }

    getAllOrders(filter = {}) {
        let orders = [...this.dashboard.orders];

        if (filter.status) {
            orders = orders.filter(o => o.status === filter.status);
        }

        if (filter.productId) {
            orders = orders.filter(o => o.productId === filter.productId);
        }

        if (filter.dateFrom) {
            orders = orders.filter(o => new Date(o.createdAt) >= new Date(filter.dateFrom));
        }

        if (filter.dateTo) {
            orders = orders.filter(o => new Date(o.createdAt) <= new Date(filter.dateTo));
        }

        return orders;
    }

    // ============================================
    // ORDER STATUS MANAGEMENT
    // ============================================

    updateOrderStatus(orderId, status) {
        const validStatuses = ['pending', 'processing', 'completed'];
        if (!validStatuses.includes(status)) {
            console.error('Invalid status:', status);
            return null;
        }

        const order = this.getOrder(orderId);
        if (order) {
            order.status = status;
            if (status === 'completed') {
                order.completedAt = new Date().toISOString();
            }
            if (status === 'processing') {
                order.processingStartedAt = new Date().toISOString();
            }
            this.dashboard.saveData();
        }

        return order;
    }

    markAsPending(orderId) {
        return this.updateOrderStatus(orderId, 'pending');
    }

    markAsProcessing(orderId) {
        return this.updateOrderStatus(orderId, 'processing');
    }

    markAsCompleted(orderId) {
        return this.updateOrderStatus(orderId, 'completed');
    }

    // ============================================
    // ORDER STATISTICS
    // ============================================

    getOrderStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(thisWeekStart.getDate() - 7);

        const thisMonthStart = new Date(today);
        thisMonthStart.setMonth(thisMonthStart.getMonth() - 1);

        return {
            total: this.dashboard.orders.length,
            pending: this.dashboard.orders.filter(o => o.status === 'pending').length,
            processing: this.dashboard.orders.filter(o => o.status === 'processing').length,
            completed: this.dashboard.orders.filter(o => o.status === 'completed').length,
            today: this.dashboard.orders.filter(o => new Date(o.createdAt) >= today).length,
            thisWeek: this.dashboard.orders.filter(o => new Date(o.createdAt) >= thisWeekStart).length,
            thisMonth: this.dashboard.orders.filter(o => new Date(o.createdAt) >= thisMonthStart).length
        };
    }

    getOrdersByProduct(productId) {
        return this.dashboard.orders.filter(o => o.productId === productId);
    }

    getOrdersByCustomerEmail(email) {
        return this.dashboard.orders.filter(o => o.email.toLowerCase() === email.toLowerCase());
    }

    // ============================================
    // ORDER ANALYTICS
    // ============================================

    getOrdersPerDay(days = 30) {
        const data = {};
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const key = date.toISOString().split('T')[0];
            data[key] = 0;
        }

        this.dashboard.orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            orderDate.setHours(0, 0, 0, 0);
            const key = orderDate.toISOString().split('T')[0];

            if (data.hasOwnProperty(key)) {
                data[key]++;
            }
        });

        return data;
    }

    getOrdersPerWeek(weeks = 12) {
        const data = {};
        const today = new Date();

        for (let i = weeks - 1; i >= 0; i--) {
            const weekStart = new Date(today);
            weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + i * 7));
            weekStart.setHours(0, 0, 0, 0);

            const key = weekStart.toISOString().split('T')[0];
            data[key] = 0;
        }

        this.dashboard.orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const weekStart = new Date(orderDate);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            weekStart.setHours(0, 0, 0, 0);

            const key = weekStart.toISOString().split('T')[0];
            if (data.hasOwnProperty(key)) {
                data[key]++;
            } else {
                // Find closest week
                const keys = Object.keys(data).sort();
                const closest = keys[keys.length - 1];
                if (closest) {
                    data[closest]++;
                }
            }
        });

        return data;
    }

    getOrdersPerMonth(months = 12) {
        const data = {};
        const today = new Date();

        for (let i = months - 1; i >= 0; i--) {
            const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = monthStart.toISOString().slice(0, 7);
            data[key] = 0;
        }

        this.dashboard.orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const key = orderDate.toISOString().slice(0, 7);

            if (data.hasOwnProperty(key)) {
                data[key]++;
            }
        });

        return data;
    }

    getTopProductsByOrders(limit = 5) {
        const productOrders = {};

        this.dashboard.orders.forEach(order => {
            if (order.productId) {
                if (!productOrders[order.productId]) {
                    productOrders[order.productId] = 0;
                }
                productOrders[order.productId]++;
            }
        });

        return Object.entries(productOrders)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([productId, count]) => {
                const product = this.dashboard.products.find(p => p.id === parseInt(productId));
                return {
                    productId: parseInt(productId),
                    product: product,
                    orderCount: count
                };
            });
    }

    getTopProductsByRevenue(limit = 5) {
        const productRevenue = {};

        this.dashboard.orders.forEach(order => {
            if (order.productId && order.price) {
                if (!productRevenue[order.productId]) {
                    productRevenue[order.productId] = 0;
                }
                productRevenue[order.productId] += order.price;
            }
        });

        return Object.entries(productRevenue)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([productId, revenue]) => {
                const product = this.dashboard.products.find(p => p.id === parseInt(productId));
                return {
                    productId: parseInt(productId),
                    product: product,
                    revenue: revenue
                };
            });
    }

    // ============================================
    // EXPORT FUNCTIONALITY
    // ============================================

    exportOrdersAsCSV() {
        const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Product', 'Price', 'Status', 'Date & Time'];
        const rows = this.dashboard.orders.map(order => [
            order.id,
            order.customerName,
            order.email,
            order.phone || '',
            order.product,
            order.price || '',
            order.status,
            new Date(order.createdAt).toLocaleString()
        ]);

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });

        return csv;
    }

    downloadOrdersAsCSV() {
        const csv = this.exportOrdersAsCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    generateOrderId() {
        return Math.floor(Date.now() / 1000);
    }

    logOrderActivity(orderId, action, details = {}) {
        const order = this.getOrder(orderId);
        if (order) {
            if (!order.activityLog) {
                order.activityLog = [];
            }

            order.activityLog.push({
                action: action,
                timestamp: new Date().toISOString(),
                details: details
            });

            this.dashboard.saveData();
        }
    }

    validateOrderData(data) {
        const errors = [];

        if (!data.customerName || data.customerName.trim() === '') {
            errors.push('Customer name is required');
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Valid email is required');
        }

        if (!data.product || data.product.trim() === '') {
            errors.push('Product is required');
        }

        if (data.phone && !this.isValidPhone(data.phone)) {
            errors.push('Valid phone number is required');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    isValidPhone(phone) {
        const re = /^[\d\s\-\+\(\)]{10,}$/;
        return re.test(phone);
    }

    // ============================================
    // NOTIFICATION/EMAIL INTEGRATION
    // ============================================

    async notifyAdminOfNewOrder(orderId) {
        const order = this.getOrder(orderId);
        if (!order) return;

        try {
            // This would integrate with EmailJS to send admin notification
            // Implementation depends on having EmailJS initialized in the main app
            if (typeof emailjs !== 'undefined') {
                await emailjs.send('service_hjaklhd', 'admin_notification_template', {
                    admin_email: 'hdiyan122@gmail.com',
                    order_id: order.id,
                    customer_name: order.customerName,
                    customer_email: order.email,
                    product: order.product,
                    message: order.message
                });

                order.adminNotified = true;
                this.dashboard.saveData();
            }
        } catch (error) {
            console.error('Failed to notify admin:', error);
        }
    }

    async sendOrderConfirmationEmail(orderId) {
        const order = this.getOrder(orderId);
        if (!order) return;

        try {
            if (typeof emailjs !== 'undefined') {
                await emailjs.send('service_hjaklhd', 'order_confirmation_template', {
                    customer_email: order.email,
                    customer_name: order.customerName,
                    product: order.product,
                    message: 'Thank you for your order. We will contact you shortly.'
                });

                order.confirmationEmailSent = true;
                this.dashboard.saveData();
            }
        } catch (error) {
            console.error('Failed to send confirmation email:', error);
        }
    }
}

// Initialize when dashboard is ready
if (typeof dashboard !== 'undefined') {
    const orderManagement = new OrderManagement(dashboard);
    window.orderManagement = orderManagement;
}
