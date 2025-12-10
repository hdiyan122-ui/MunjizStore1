// ============================================
// ANALYTICS MODULE
// ============================================

class AnalyticsEngine {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.init();
    }

    init() {
        this.setupClickTracking();
    }

    // ============================================
    // CLICK TRACKING
    // ============================================

    setupClickTracking() {
        // This is called from the main website to track contact clicks
        window.trackContactClick = (details = {}) => {
            this.recordClick(details);
        };
    }

    recordClick(details = {}) {
        if (!this.dashboard.clickStats.history) {
            this.dashboard.clickStats.history = [];
        }

        this.dashboard.clickStats.history.push(new Date().toISOString());
        this.dashboard.clickStats.total = (this.dashboard.clickStats.total || 0) + 1;

        // Update period counts
        const today = new Date().toDateString();
        const thisWeekStart = new Date();
        thisWeekStart.setDate(thisWeekStart.getDate() - 7);
        const thisMonthStart = new Date();
        thisMonthStart.setMonth(thisMonthStart.getMonth() - 1);

        this.dashboard.clickStats.today = this.dashboard.clickStats.history.filter(
            h => new Date(h).toDateString() === today
        ).length;

        this.dashboard.clickStats.week = this.dashboard.clickStats.history.filter(
            h => new Date(h) >= thisWeekStart
        ).length;

        this.dashboard.clickStats.month = this.dashboard.clickStats.history.filter(
            h => new Date(h) >= thisMonthStart
        ).length;

        this.dashboard.saveData();
    }

    // ============================================
    // ANALYTICS CALCULATIONS
    // ============================================

    getOrderAnalytics() {
        return {
            totalOrders: this.dashboard.orders.length,
            totalRevenue: this.getTotalRevenue(),
            averageOrderValue: this.getAverageOrderValue(),
            ordersByStatus: this.getOrdersByStatus(),
            ordersByCategory: this.getOrdersByCategory(),
            orderTrends: this.getOrderTrends()
        };
    }

    getTotalRevenue() {
        return this.dashboard.orders.reduce((total, order) => {
            return total + (order.price || 0);
        }, 0);
    }

    getAverageOrderValue() {
        if (this.dashboard.orders.length === 0) return 0;
        return this.getTotalRevenue() / this.dashboard.orders.length;
    }

    getOrdersByStatus() {
        const stats = {
            pending: 0,
            processing: 0,
            completed: 0
        };

        this.dashboard.orders.forEach(order => {
            if (stats.hasOwnProperty(order.status)) {
                stats[order.status]++;
            }
        });

        return stats;
    }

    getOrdersByCategory() {
        const stats = {};

        this.dashboard.orders.forEach(order => {
            const product = this.dashboard.products.find(p => p.id === order.productId);
            if (product) {
                if (!stats[product.category]) {
                    stats[product.category] = {
                        count: 0,
                        revenue: 0
                    };
                }
                stats[product.category].count++;
                stats[product.category].revenue += order.price || 0;
            }
        });

        return stats;
    }

    getOrderTrends() {
        const today = new Date();
        const trends = {
            daily: {},
            weekly: {},
            monthly: {}
        };

        // Daily trends (last 30 days)
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split('T')[0];
            trends.daily[key] = 0;
        }

        // Weekly trends (last 12 weeks)
        for (let i = 11; i >= 0; i--) {
            const week = new Date(today);
            week.setDate(week.getDate() - (week.getDay() + i * 7));
            week.setHours(0, 0, 0, 0);
            const key = week.toISOString().split('T')[0];
            trends.weekly[key] = 0;
        }

        // Monthly trends (last 12 months)
        for (let i = 11; i >= 0; i--) {
            const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = month.toISOString().slice(0, 7);
            trends.monthly[key] = 0;
        }

        // Populate trends with actual data
        this.dashboard.orders.forEach(order => {
            const orderDate = new Date(order.createdAt);

            // Daily
            const dayKey = orderDate.toISOString().split('T')[0];
            if (trends.daily.hasOwnProperty(dayKey)) {
                trends.daily[dayKey]++;
            }

            // Weekly
            const weekStart = new Date(orderDate);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            weekStart.setHours(0, 0, 0, 0);
            const weekKey = weekStart.toISOString().split('T')[0];
            if (trends.weekly.hasOwnProperty(weekKey)) {
                trends.weekly[weekKey]++;
            }

            // Monthly
            const monthKey = orderDate.toISOString().slice(0, 7);
            if (trends.monthly.hasOwnProperty(monthKey)) {
                trends.monthly[monthKey]++;
            }
        });

        return trends;
    }

    // ============================================
    // PRODUCT ANALYTICS
    // ============================================

    getProductAnalytics() {
        return {
            totalProducts: this.dashboard.products.length,
            activeProducts: this.getActiveProductsCount(),
            productsByCategory: this.getProductsByCategory(),
            topSellingProducts: this.getTopSellingProducts(),
            productPerformance: this.getProductPerformance()
        };
    }

    getActiveProductsCount() {
        return this.dashboard.products.filter(p => p.status === 'active').length;
    }

    getProductsByCategory() {
        const stats = {};

        this.dashboard.products.forEach(product => {
            if (!stats[product.category]) {
                stats[product.category] = 0;
            }
            stats[product.category]++;
        });

        return stats;
    }

    getTopSellingProducts(limit = 10) {
        const productSales = {};

        this.dashboard.orders.forEach(order => {
            if (!productSales[order.productId]) {
                productSales[order.productId] = {
                    count: 0,
                    revenue: 0
                };
            }
            productSales[order.productId].count++;
            productSales[order.productId].revenue += order.price || 0;
        });

        return Object.entries(productSales)
            .map(([productId, data]) => {
                const product = this.dashboard.products.find(p => p.id === parseInt(productId));
                return {
                    product: product,
                    orderCount: data.count,
                    totalRevenue: data.revenue,
                    averagePrice: product ? product.price : 0
                };
            })
            .sort((a, b) => b.orderCount - a.orderCount)
            .slice(0, limit);
    }

    getProductPerformance() {
        return this.dashboard.products.map(product => {
            const orders = this.dashboard.orders.filter(o => o.productId === product.id);
            return {
                product: product,
                orderCount: orders.length,
                revenue: orders.reduce((sum, o) => sum + (o.price || 0), 0),
                lastOrderDate: orders.length > 0 ? 
                    new Date(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt) :
                    null
            };
        });
    }

    // ============================================
    // CUSTOMER ANALYTICS
    // ============================================

    getCustomerAnalytics() {
        return {
            totalCustomers: this.getTotalUniqueCustomers(),
            repeatCustomers: this.getRepeatCustomers(),
            customersBySource: this.getCustomersBySource(),
            topCustomers: this.getTopCustomers()
        };
    }

    getTotalUniqueCustomers() {
        const emails = new Set(this.dashboard.orders.map(o => o.email.toLowerCase()));
        return emails.size;
    }

    getRepeatCustomers() {
        const emailCounts = {};

        this.dashboard.orders.forEach(order => {
            const email = order.email.toLowerCase();
            emailCounts[email] = (emailCounts[email] || 0) + 1;
        });

        return Object.values(emailCounts).filter(count => count > 1).length;
    }

    getCustomersBySource() {
        // This would require additional tracking in orders
        return {
            direct: this.dashboard.orders.length,
            referral: 0,
            social: 0
        };
    }

    getTopCustomers(limit = 10) {
        const customerSpending = {};

        this.dashboard.orders.forEach(order => {
            const email = order.email.toLowerCase();
            if (!customerSpending[email]) {
                customerSpending[email] = {
                    name: order.customerName,
                    email: order.email,
                    orderCount: 0,
                    totalSpent: 0
                };
            }
            customerSpending[email].orderCount++;
            customerSpending[email].totalSpent += order.price || 0;
        });

        return Object.values(customerSpending)
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, limit);
    }

    // ============================================
    // CLICK ANALYTICS
    // ============================================

    getClickAnalytics() {
        return {
            totalClicks: this.dashboard.clickStats.total || 0,
            clicksByDay: this.getClicksByDay(),
            clicksByWeek: this.getClicksByWeek(),
            clicksByMonth: this.getClicksByMonth()
        };
    }

    getClicksByDay(days = 30) {
        const data = {};
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const key = date.toISOString().split('T')[0];
            data[key] = 0;
        }

        const history = this.dashboard.clickStats.history || [];
        history.forEach(clickDate => {
            const date = new Date(clickDate);
            date.setHours(0, 0, 0, 0);
            const key = date.toISOString().split('T')[0];

            if (data.hasOwnProperty(key)) {
                data[key]++;
            }
        });

        return data;
    }

    getClicksByWeek(weeks = 12) {
        const data = {};
        const today = new Date();

        for (let i = weeks - 1; i >= 0; i--) {
            const week = new Date(today);
            week.setDate(week.getDate() - (week.getDay() + i * 7));
            week.setHours(0, 0, 0, 0);
            const key = week.toISOString().split('T')[0];
            data[key] = 0;
        }

        const history = this.dashboard.clickStats.history || [];
        history.forEach(clickDate => {
            const click = new Date(clickDate);
            const week = new Date(click);
            week.setDate(week.getDate() - week.getDay());
            week.setHours(0, 0, 0, 0);
            const key = week.toISOString().split('T')[0];

            if (data.hasOwnProperty(key)) {
                data[key]++;
            }
        });

        return data;
    }

    getClicksByMonth(months = 12) {
        const data = {};
        const today = new Date();

        for (let i = months - 1; i >= 0; i--) {
            const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = month.toISOString().slice(0, 7);
            data[key] = 0;
        }

        const history = this.dashboard.clickStats.history || [];
        history.forEach(clickDate => {
            const click = new Date(clickDate);
            const key = click.toISOString().slice(0, 7);

            if (data.hasOwnProperty(key)) {
                data[key]++;
            }
        });

        return data;
    }

    // ============================================
    // REVENUE ANALYTICS
    // ============================================

    getRevenueAnalytics() {
        return {
            totalRevenue: this.getTotalRevenue(),
            revenueByProduct: this.getRevenueByProduct(),
            revenueByCategory: this.getRevenueByCategory(),
            revenueTrends: this.getRevenueTrends()
        };
    }

    getRevenueByProduct() {
        const revenue = {};

        this.dashboard.orders.forEach(order => {
            if (!revenue[order.productId]) {
                revenue[order.productId] = 0;
            }
            revenue[order.productId] += order.price || 0;
        });

        return Object.entries(revenue)
            .map(([productId, total]) => {
                const product = this.dashboard.products.find(p => p.id === parseInt(productId));
                return {
                    product: product,
                    revenue: total
                };
            })
            .sort((a, b) => b.revenue - a.revenue);
    }

    getRevenueByCategory() {
        const revenue = {};

        this.dashboard.orders.forEach(order => {
            const product = this.dashboard.products.find(p => p.id === order.productId);
            if (product) {
                if (!revenue[product.category]) {
                    revenue[product.category] = 0;
                }
                revenue[product.category] += order.price || 0;
            }
        });

        return revenue;
    }

    getRevenueTrends() {
        const today = new Date();
        const trends = {
            daily: {},
            weekly: {},
            monthly: {}
        };

        // Initialize with zeros
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split('T')[0];
            trends.daily[key] = 0;
        }

        // Populate with actual revenue
        this.dashboard.orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const key = orderDate.toISOString().split('T')[0];

            if (trends.daily.hasOwnProperty(key)) {
                trends.daily[key] += order.price || 0;
            }
        });

        return trends;
    }

    // ============================================
    // REPORT GENERATION
    // ============================================

    generateComprehensiveReport() {
        return {
            generatedAt: new Date().toISOString(),
            orders: this.getOrderAnalytics(),
            products: this.getProductAnalytics(),
            customers: this.getCustomerAnalytics(),
            clicks: this.getClickAnalytics(),
            revenue: this.getRevenueAnalytics()
        };
    }

    generateSummaryReport() {
        const report = this.generateComprehensiveReport();
        return {
            generatedAt: report.generatedAt,
            totalOrders: report.orders.totalOrders,
            totalRevenue: report.orders.totalRevenue,
            averageOrderValue: report.orders.averageOrderValue,
            totalCustomers: report.customers.totalCustomers,
            totalClicks: report.clicks.totalClicks,
            topProduct: report.products.topSellingProducts[0],
            pendingOrders: report.orders.ordersByStatus.pending
        };
    }

    exportReportAsJSON() {
        const report = this.generateComprehensiveReport();
        return JSON.stringify(report, null, 2);
    }

    downloadReportAsJSON() {
        const json = this.exportReportAsJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_report_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// Initialize when dashboard is ready
if (typeof dashboard !== 'undefined') {
    const analytics = new AnalyticsEngine(dashboard);
    window.analyticsEngine = analytics;
}
