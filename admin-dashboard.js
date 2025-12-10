// ============================================
// ADMIN DASHBOARD - MAIN LOGIC
// ============================================

class AdminDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentOrderId = null;
        this.products = [];
        this.orders = [];
        this.clickStats = { total: 0, today: 0, week: 0, month: 0 };
        
        this.init();
    }

    async init() {
        // Wait for Firebase to initialize
        await this.waitForFirebase();
        
        // Check if user is authenticated
        if (!firebaseDB.isAuthenticated()) {
            // Show login page instead of dashboard
            this.showLoginPage();
            return;
        }

        // Load data from Firebase
        await this.loadDataFromFirebase();
        this.setupEventListeners();
        this.setupNavigation();
        this.setupImageHandler();
        this.setupTheme();
        this.renderDashboard();

        // Listen for real-time product updates
        firebaseDB.onProductsChange((products) => {
            this.products = products;
            this.renderProducts();
        });
    }

    /**
     * Wait for Firebase to initialize
     */
    async waitForFirebase() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (firebaseDB && firebaseDB.initialized) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);

            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 10000);
        });
    }

    /**
     * Show login page for unauthenticated users
     */
    showLoginPage() {
        const mainContent = document.querySelector('.admin-content');
        mainContent.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: var(--bg-color);">
                <div style="background: var(--card-bg); padding: 40px; border-radius: 8px; max-width: 400px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h2 style="margin-bottom: 30px; text-align: center; color: var(--text-color);">Admin Login</h2>
                    <form id="loginForm" style="display: flex; flex-direction: column; gap: 15px;">
                        <input type="email" id="loginEmail" placeholder="Email" required style="padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-color);">
                        <input type="password" id="loginPassword" placeholder="Password" required style="padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-color);">
                        <button type="submit" style="padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Login</button>
                        <p style="text-align: center; color: var(--text-color); margin-top: 20px;">
                            Don't have an account? <button type="button" id="signupToggle" style="background: none; border: none; color: #2196F3; cursor: pointer; text-decoration: underline;">Sign up</button>
                        </p>
                    </form>

                    <form id="signupForm" style="display: none; flex-direction: column; gap: 15px;">
                        <input type="email" id="signupEmail" placeholder="Email" required style="padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-color);">
                        <input type="password" id="signupPassword" placeholder="Password (min 6 chars)" required style="padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-color);">
                        <button type="submit" style="padding: 10px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Sign up</button>
                        <p style="text-align: center; color: var(--text-color); margin-top: 20px;">
                            Already have an account? <button type="button" id="loginToggle" style="background: none; border: none; color: #4CAF50; cursor: pointer; text-decoration: underline;">Login</button>
                        </p>
                    </form>
                </div>
            </div>
        `;

        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        
        document.getElementById('signupToggle').addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            signupForm.style.display = 'flex';
        });

        document.getElementById('loginToggle').addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'flex';
            signupForm.style.display = 'none';
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = await firebaseDB.signIn(email, password);
            if (result.success) {
                // Re-initialize dashboard after login
                location.reload();
            } else {
                alert('Login failed: ' + result.error);
            }
        });

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters');
                return;
            }

            const result = await firebaseDB.signUp(email, password);
            if (result.success) {
                alert('Account created! You can now login.');
                loginForm.style.display = 'flex';
                signupForm.style.display = 'none';
            } else {
                alert('Sign up failed: ' + result.error);
            }
        });

        // Listen for authentication changes
        document.addEventListener('userAuthenticated', () => {
            location.reload();
        });
    }

    // ============================================
    // DATA MANAGEMENT - FIREBASE VERSION
    // ============================================

    /**
     * Load products from Firebase Firestore
     */
    async loadDataFromFirebase() {
        try {
            // Load products from Firestore
            const productsResult = await firebaseDB.getAllProducts();
            if (productsResult.success && productsResult.products.length > 0) {
                this.products = productsResult.products;
            } else {
                // Initialize with default products on first use
                this.products = this.getDefaultProducts();
                // Save default products to Firebase
                for (const product of this.products) {
                    await firebaseDB.saveProduct(product);
                }
            }

            // Load orders from Firebase
            const ordersResult = await firebaseDB.getAllOrders();
            if (ordersResult.success) {
                this.orders = ordersResult.orders;
            } else {
                this.orders = [];
            }

            console.log('Data loaded from Firebase:', this.products.length, 'products');
        } catch (error) {
            console.error('Error loading data from Firebase:', error);
            this.products = this.getDefaultProducts();
            this.orders = [];
        }
    }

    /**
     * Save product to Firebase
     */
    async saveProduct(product) {
        try {
            const result = await firebaseDB.saveProduct(product);
            if (result.success) {
                // Update local products list
                const index = this.products.findIndex(p => p.id === product.id);
                if (index > -1) {
                    this.products[index] = product;
                } else {
                    this.products.push(product);
                }
                this.renderProducts();
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Error saving product:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete product from Firebase
     */
    async deleteProduct(productId) {
        try {
            const result = await firebaseDB.deleteProduct(productId);
            if (result.success) {
                this.products = this.products.filter(p => p.id !== productId.toString());
                this.renderProducts();
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            return { success: false, error: error.message };
        }
    }

    getDefaultProducts() {
        return [
            {
                id: 1,
                name: 'Django Web Development',
                category: 'courses',
                price: 55,
                image: 'https://via.placeholder.com/300x200?text=Django+Course',
                shortDesc: 'Master Django framework from basics to advanced',
                longDesc: 'Complete Django course covering models, views, templates, authentication, and deployment',
                createdAt: new Date('2024-01-15').toISOString(),
                status: 'active'
            },
            {
                id: 2,
                name: 'WhatsApp Bot Development',
                category: 'services',
                price: 155,
                image: 'https://via.placeholder.com/300x200?text=WhatsApp+Bot',
                shortDesc: 'Create automated WhatsApp bots for your business',
                longDesc: 'Learn to build custom WhatsApp bots with message handling, media support, and API integration',
                createdAt: new Date('2024-01-10').toISOString(),
                status: 'active'
            },
            {
                id: 3,
                name: 'Professional Website Design',
                category: 'services',
                price: 550,
                image: 'https://via.placeholder.com/300x200?text=Web+Design',
                shortDesc: 'Custom website design and development service',
                longDesc: 'Full-service website design, development, and deployment with SEO optimization',
                createdAt: new Date('2024-01-05').toISOString(),
                status: 'active'
            },
            {
                id: 4,
                name: 'Digital Marketing Academy',
                category: 'courses',
                price: 999,
                image: 'https://via.placeholder.com/300x200?text=Digital+Marketing',
                shortDesc: 'Complete digital marketing training program',
                longDesc: 'Comprehensive digital marketing course covering SEO, SEM, social media, and analytics',
                createdAt: new Date('2023-12-20').toISOString(),
                status: 'active'
            },
            {
                id: 5,
                name: 'Profit Bundle - All Courses',
                category: 'ebooks',
                price: 25,
                image: 'https://via.placeholder.com/300x200?text=Bundle',
                shortDesc: 'Special bundle with all our courses and resources',
                longDesc: 'Get access to all Munjiz courses and exclusive e-books at a special price',
                createdAt: new Date('2023-12-01').toISOString(),
                status: 'active'
            }
        ];
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Theme toggle
        document.getElementById('themeToggleAdmin').addEventListener('click', () => this.toggleTheme());

        // Product modal
        document.getElementById('addProductBtn').addEventListener('click', () => this.openProductModal());
        document.querySelector('#productModal .modal-close').addEventListener('click', () => this.closeProductModal());
        document.getElementById('productForm').addEventListener('submit', (e) => this.handleProductSubmit(e));

        // Order modal
        document.querySelector('#orderModal .modal-close').addEventListener('click', () => this.closeOrderModal());
        document.getElementById('updateOrderBtn').addEventListener('click', () => this.updateOrderStatus());

        // Order status filter
        document.getElementById('orderStatusFilter').addEventListener('change', () => this.renderOrders());

        // Analytics period tabs
        document.querySelectorAll('.period-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.handleAnalyticsPeriod(e));
        });

        // Click outside modal
        window.addEventListener('click', (e) => this.handleModalClick(e));
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });
    }

    // ============================================
    // IMAGE HANDLING - BASE64 CONVERSION
    // ============================================

    setupImageHandler() {
        const imageInput = document.getElementById('productImage');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Use ImageHandler to convert file to Base64
        imageHandler.fileToBase64(file)
            .then(base64String => {
                // Store Base64 temporarily in form
                document.getElementById('productForm').dataset.imageBase64 = base64String;
                
                // Show preview
                const previewContainer = document.getElementById('imagePreviewContainer');
                const previewImg = document.getElementById('imagePreviewImg');
                
                previewImg.src = base64String;
                previewContainer.style.display = 'block';
                
                // Optional: Show file size info
                const fileSize = (file.size / (1024 * 1024)).toFixed(2);
                console.log(`Image uploaded: ${file.name} (${fileSize}MB)`);
            })
            .catch(error => {
                this.showNotification(`Error: ${error.message}`, 'error');
                e.target.value = '';
            });
    }

    // ============================================
    // NAVIGATION & SECTIONS
    // ============================================

    handleNavigation(e) {
        const section = e.currentTarget.dataset.section;
        this.switchSection(section);
    }

    switchSection(section) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(s => {
            s.classList.remove('active');
        });

        // Show selected section
        document.getElementById(section).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            products: 'Product Management',
            orders: 'Order Management',
            analytics: 'Analytics',
            settings: 'Settings'
        };
        document.getElementById('pageTitle').textContent = titles[section];

        // Render section content
        switch(section) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'products':
                this.renderProducts();
                break;
            case 'orders':
                this.renderOrders();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }

        this.currentSection = section;
    }

    // ============================================
    // DASHBOARD SECTION
    // ============================================

    renderDashboard() {
        // Update stats
        document.getElementById('totalOrders').textContent = this.orders.length;
        document.getElementById('totalProducts').textContent = this.products.filter(p => p.status === 'active').length;
        document.getElementById('totalClicks').textContent = this.clickStats.total || 0;
        document.getElementById('pendingOrders').textContent = this.orders.filter(o => o.status === 'pending').length;

        // Render top products
        this.renderTopProducts();

        // Render weekly chart
        this.renderWeeklyChart();
    }

    renderTopProducts() {
        const topProductsList = document.getElementById('topProductsList');
        const topProducts = this.orders
            .reduce((acc, order) => {
                const existing = acc.find(p => p.id === order.productId);
                if (existing) {
                    existing.count++;
                } else {
                    const product = this.products.find(p => p.id === order.productId);
                    if (product) {
                        acc.push({ ...product, count: 1 });
                    }
                }
                return acc;
            }, [])
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        topProductsList.innerHTML = topProducts.map(p => `
            <div class="product-item">
                <div>
                    <p class="product-name">${p.name}</p>
                    <p class="product-count">${p.count} orders</p>
                </div>
                <div class="product-count">$${p.price}</div>
            </div>
        `).join('');
    }

    renderWeeklyChart() {
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) return;

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = new Array(7).fill(0);
        
        const today = new Date();
        this.orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const diff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
            if (diff < 7) {
                data[6 - diff]++;
            }
        });

        if (window.weeklyChartInstance) {
            window.weeklyChartInstance.destroy();
        }

        window.weeklyChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Orders',
                    data: data,
                    backgroundColor: 'rgba(255, 0, 0, 0.7)',
                    borderColor: '#FF0000',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#333333'
                        },
                        ticks: {
                            color: '#b0b0b0'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#b0b0b0'
                        }
                    }
                }
            }
        });
    }

    // ============================================
    // PRODUCTS SECTION
    // ============================================

    renderProducts() {
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = this.products.map(product => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${product.image}" alt="${product.name}" style="width: 30px; height: 30px; border-radius: 4px;">
                        ${product.name}
                    </div>
                </td>
                <td>${this.getCategoryLabel(product.category)}</td>
                <td>$${product.price}</td>
                <td>
                    <span class="status-badge status-${product.status}">
                        ${product.status === 'active' ? 'Visible' : 'Hidden'}
                    </span>
                </td>
                <td>${new Date(product.createdAt).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="dashboard.editProduct(${product.id})">Edit</button>
                        <button class="action-btn" onclick="dashboard.toggleProductVisibility(${product.id})">
                            ${product.status === 'active' ? 'Hide' : 'Show'}
                        </button>
                        <button class="action-btn" onclick="dashboard.onDeleteProductClick(${product.id})" style="color: #ef4444; border-color: #ef4444;">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getCategoryLabel(category) {
        const labels = {
            'courses': 'Course',
            'ebooks': 'E-book',
            'services': 'Service',
            'ai-tools': 'AI Tool'
        };
        return labels[category] || category;
    }

    openProductModal(productId = null) {
        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        form.reset();
        
        // Reset image-related elements
        delete form.dataset.imageBase64;
        document.getElementById('imagePreviewContainer').style.display = 'none';
        document.getElementById('imagePreviewImg').src = '';

        if (productId) {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                document.getElementById('productModalTitle').textContent = 'Edit Product';
                document.getElementById('productName').value = product.name;
                document.getElementById('productCategory').value = product.category;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productShortDesc').value = product.shortDesc;
                document.getElementById('productLongDesc').value = product.longDesc;
                
                // Store existing image (could be Base64 or URL)
                form.dataset.imageBase64 = product.image;
                
                // Show preview of existing image
                const previewContainer = document.getElementById('imagePreviewContainer');
                const previewImg = document.getElementById('imagePreviewImg');
                previewImg.src = product.image;
                previewContainer.style.display = 'block';
                
                form.dataset.productId = productId;
            }
        } else {
            document.getElementById('productModalTitle').textContent = 'Add Product';
            delete form.dataset.productId;
        }

        modal.classList.add('active');
    }

    closeProductModal() {
        document.getElementById('productModal').classList.remove('active');
    }

    async handleProductSubmit(e) {
        e.preventDefault();

        const form = document.getElementById('productForm');
        const productId = form.dataset.productId;
        
        // Get Base64 image - either new upload or existing
        const imageBase64 = form.dataset.imageBase64;
        if (!imageBase64) {
            this.showNotification('Please upload an image', 'error');
            return;
        }

        const productData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            image: imageBase64,  // Store Base64 directly
            shortDesc: document.getElementById('productShortDesc').value,
            longDesc: document.getElementById('productLongDesc').value,
            updatedAt: new Date().toISOString()
        };

        let product;
        if (productId) {
            // Edit existing product
            product = { id: productId, ...productData };
        } else {
            // Add new product
            product = {
                ...productData,
                createdAt: new Date().toISOString(),
                status: 'active'
            };
        }

        // Save to Firebase
        const result = await this.saveProduct(product);
        if (result.success) {
            this.closeProductModal();
            this.showNotification('Product saved successfully!');
        } else {
            this.showNotification('Error saving product: ' + result.error, 'error');
        }
    }

    editProduct(productId) {
        this.openProductModal(productId);
    }

    toggleProductVisibility(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.status = product.status === 'active' ? 'hidden' : 'active';
            this.saveData();
            this.renderProducts();
        }
    }

    async onDeleteProductClick(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            const result = await this.deleteProduct(productId);
            if (result.success) {
                this.showNotification('Product deleted successfully!');
            } else {
                this.showNotification('Error deleting product: ' + result.error, 'error');
            }
        }
    }

    // ============================================
    // ORDERS SECTION
    // ============================================

    renderOrders() {
        const tbody = document.getElementById('ordersTableBody');
        const statusFilter = document.getElementById('orderStatusFilter').value;

        let filteredOrders = this.orders;
        if (statusFilter) {
            filteredOrders = filteredOrders.filter(o => o.status === statusFilter);
        }

        tbody.innerHTML = filteredOrders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.email}</td>
                <td>${order.product}</td>
                <td>
                    <span class="status-badge status-${order.status}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </td>
                <td>${new Date(order.createdAt).toLocaleString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="dashboard.viewOrder(${order.id})">View</button>
                        <button class="action-btn" onclick="dashboard.updateOrderStatus(${order.id})">Mark</button>
                    </div>
                </td>
            </tr>
        `).join('');

        if (filteredOrders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">No orders found</td></tr>';
        }
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        this.currentOrderId = orderId;

        const detailsDiv = document.getElementById('orderDetails');
        detailsDiv.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Order ID</span>
                <span class="detail-value">#${order.id}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Customer Name</span>
                <span class="detail-value">${order.customerName}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Email</span>
                <span class="detail-value">${order.email}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Phone</span>
                <span class="detail-value">${order.phone || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Product</span>
                <span class="detail-value">${order.product}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Price</span>
                <span class="detail-value">$${order.price || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Message</span>
                <span class="detail-value">${order.message}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Date & Time</span>
                <span class="detail-value">${new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Current Status</span>
                <span class="detail-value" style="color: #FF0000; font-weight: 600;">
                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </div>
        `;

        document.getElementById('orderStatusSelect').value = order.status;
        document.getElementById('orderModal').classList.add('active');
    }

    updateOrderStatus(orderId = null) {
        const actualOrderId = orderId || this.currentOrderId;
        if (!actualOrderId) return;

        const order = this.orders.find(o => o.id === actualOrderId);
        if (!order) return;

        const newStatus = document.getElementById('orderStatusSelect').value;
        order.status = newStatus;
        this.saveData();
        
        this.closeOrderModal();
        this.renderOrders();
        this.showNotification('Order status updated successfully!');
    }

    closeOrderModal() {
        document.getElementById('orderModal').classList.remove('active');
        this.currentOrderId = null;
    }

    // ============================================
    // ANALYTICS SECTION
    // ============================================

    renderAnalytics() {
        this.renderAnalyticsChart();
        this.renderAnalyticsPopularProducts();
        this.renderAnalyticsClickStats();
        this.renderCategoryChart();
    }

    renderAnalyticsChart() {
        const canvas = document.getElementById('analyticsChart');
        if (!canvas) return;

        const period = document.querySelector('.period-tab.active')?.dataset.period || 'day';
        const { labels, data } = this.getAnalyticsData(period);

        if (window.analyticsChartInstance) {
            window.analyticsChartInstance.destroy();
        }

        window.analyticsChartInstance = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Orders',
                    data: data,
                    borderColor: '#FF0000',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#FF0000',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#333333'
                        },
                        ticks: {
                            color: '#b0b0b0'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#b0b0b0'
                        }
                    }
                }
            }
        });
    }

    getAnalyticsData(period) {
        const today = new Date();
        let labels = [];
        let data = [];

        if (period === 'day') {
            // Last 24 hours
            for (let i = 23; i >= 0; i--) {
                const date = new Date(today);
                date.setHours(date.getHours() - i);
                labels.push(date.getHours() + ':00');
            }
            data = new Array(24).fill(0);
        } else if (period === 'week') {
            // Last 7 days
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            labels = days;
            data = new Array(7).fill(0);
            
            this.orders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                const diff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
                if (diff < 7) {
                    data[6 - diff]++;
                }
            });
        } else if (period === 'month') {
            // Last 30 days
            for (let i = 29; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                labels.push(date.getDate());
            }
            data = new Array(30).fill(0);
            
            this.orders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                const diff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
                if (diff < 30) {
                    data[29 - diff]++;
                }
            });
        }

        return { labels, data };
    }

    renderAnalyticsPopularProducts() {
        const list = document.getElementById('popularProductsList');
        const topProducts = this.orders
            .reduce((acc, order) => {
                const existing = acc.find(p => p.id === order.productId);
                if (existing) {
                    existing.count++;
                } else {
                    const product = this.products.find(p => p.id === order.productId);
                    if (product) {
                        acc.push({ ...product, count: 1 });
                    }
                }
                return acc;
            }, [])
            .sort((a, b) => b.count - a.count);

        list.innerHTML = topProducts.map((p, i) => `
            <div class="analytics-item">
                <div>
                    <strong>${i + 1}. ${p.name}</strong>
                </div>
                <div style="text-align: right;">
                    <strong style="color: #FF0000;">${p.count}</strong>
                    <span style="color: #b0b0b0; margin-left: 10px;">orders</span>
                </div>
            </div>
        `).join('');

        if (topProducts.length === 0) {
            list.innerHTML = '<p style="color: #b0b0b0;">No orders yet</p>';
        }
    }

    renderAnalyticsClickStats() {
        document.getElementById('totalClicksAnalytics').textContent = this.clickStats.total || 0;
        
        const today = new Date().toDateString();
        const thisWeekStart = new Date();
        thisWeekStart.setDate(thisWeekStart.getDate() - 7);
        const thisMonthStart = new Date();
        thisMonthStart.setMonth(thisMonthStart.getMonth() - 1);

        const history = this.clickStats.history || [];
        const todayClicks = history.filter(h => new Date(h).toDateString() === today).length;
        const weekClicks = history.filter(h => new Date(h) >= thisWeekStart).length;
        const monthClicks = history.filter(h => new Date(h) >= thisMonthStart).length;

        document.getElementById('todayClicks').textContent = todayClicks;
        document.getElementById('weekClicks').textContent = weekClicks;
        document.getElementById('monthClicks').textContent = monthClicks;
    }

    renderCategoryChart() {
        const canvas = document.getElementById('categoryChart');
        if (!canvas) return;

        const categories = {};
        this.products.forEach(product => {
            if (!categories[product.category]) {
                categories[product.category] = 0;
            }
            categories[product.category]++;
        });

        const labels = Object.keys(categories).map(c => this.getCategoryLabel(c));
        const data = Object.values(categories);

        if (window.categoryChartInstance) {
            window.categoryChartInstance.destroy();
        }

        window.categoryChartInstance = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(255, 0, 0, 0.8)',
                        'rgba(255, 0, 0, 0.6)',
                        'rgba(255, 0, 0, 0.4)',
                        'rgba(255, 0, 0, 0.2)'
                    ],
                    borderColor: '#000000'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#b0b0b0'
                        }
                    }
                }
            }
        });
    }

    handleAnalyticsPeriod(e) {
        document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.renderAnalyticsChart();
    }

    // ============================================
    // SETTINGS SECTION
    // ============================================

    renderSettings() {
        const settings = JSON.parse(localStorage.getItem('munjizSettings')) || this.getDefaultSettings();

        document.getElementById('contactEmail').value = settings.contact.email || '';
        document.getElementById('contactWhatsapp').value = settings.contact.whatsapp || '';
        document.getElementById('contactPaypal').value = settings.contact.paypal || '';
        document.getElementById('contactInstagram').value = settings.contact.instagram || '';

        document.getElementById('defaultCurrency').value = settings.currency.default || 'USD';
        document.querySelectorAll('input[name="currencies"]').forEach(cb => {
            cb.checked = settings.currency.available.includes(cb.value);
        });

        document.getElementById('defaultLanguage').value = settings.language.default || 'en';
        document.querySelectorAll('input[name="languages"]').forEach(cb => {
            cb.checked = settings.language.available.includes(cb.value);
        });

        document.querySelector(`input[name="theme"][value="${settings.theme.default}"]`).checked = true;

        // Setup form submissions
        document.getElementById('contactForm').onsubmit = (e) => this.handleContactSettingSubmit(e);
        document.getElementById('currencyForm').onsubmit = (e) => this.handleCurrencySettingSubmit(e);
        document.getElementById('languageForm').onsubmit = (e) => this.handleLanguageSettingSubmit(e);
        document.getElementById('themeForm').onsubmit = (e) => this.handleThemeSettingSubmit(e);
    }

    getDefaultSettings() {
        return {
            contact: {
                email: 'hdiyan122@gmail.com',
                whatsapp: '+1234567890',
                paypal: 'business@paypal.com',
                instagram: '@munjiz'
            },
            currency: {
                default: 'USD',
                available: ['USD', 'EUR', 'MAD']
            },
            language: {
                default: 'en',
                available: ['en', 'ar', 'fr']
            },
            theme: {
                default: 'dark'
            }
        };
    }

    handleContactSettingSubmit(e) {
        e.preventDefault();
        const settings = JSON.parse(localStorage.getItem('munjizSettings')) || this.getDefaultSettings();
        
        settings.contact = {
            email: document.getElementById('contactEmail').value,
            whatsapp: document.getElementById('contactWhatsapp').value,
            paypal: document.getElementById('contactPaypal').value,
            instagram: document.getElementById('contactInstagram').value
        };

        localStorage.setItem('munjizSettings', JSON.stringify(settings));
        this.showNotification('Contact information updated!');
    }

    handleCurrencySettingSubmit(e) {
        e.preventDefault();
        const settings = JSON.parse(localStorage.getItem('munjizSettings')) || this.getDefaultSettings();
        
        settings.currency = {
            default: document.getElementById('defaultCurrency').value,
            available: Array.from(document.querySelectorAll('input[name="currencies"]:checked')).map(cb => cb.value)
        };

        localStorage.setItem('munjizSettings', JSON.stringify(settings));
        this.showNotification('Currency settings updated!');
    }

    handleLanguageSettingSubmit(e) {
        e.preventDefault();
        const settings = JSON.parse(localStorage.getItem('munjizSettings')) || this.getDefaultSettings();
        
        settings.language = {
            default: document.getElementById('defaultLanguage').value,
            available: Array.from(document.querySelectorAll('input[name="languages"]:checked')).map(cb => cb.value)
        };

        localStorage.setItem('munjizSettings', JSON.stringify(settings));
        this.showNotification('Language settings updated!');
    }

    handleThemeSettingSubmit(e) {
        e.preventDefault();
        const settings = JSON.parse(localStorage.getItem('munjizSettings')) || this.getDefaultSettings();
        
        settings.theme = {
            default: document.querySelector('input[name="theme"]:checked').value
        };

        localStorage.setItem('munjizSettings', JSON.stringify(settings));
        this.showNotification('Theme settings updated!');
    }

    // ============================================
    // THEME MANAGEMENT
    // ============================================

    setupTheme() {
        const settings = JSON.parse(localStorage.getItem('munjizSettings')) || this.getDefaultSettings();
        if (settings.theme.default === 'light') {
            document.body.classList.add('light-mode');
        }
    }

    toggleTheme() {
        document.body.classList.toggle('light-mode');
        
        const isLight = document.body.classList.contains('light-mode');
        const settings = JSON.parse(localStorage.getItem('munjizSettings')) || this.getDefaultSettings();
        settings.theme.default = isLight ? 'light' : 'dark';
        localStorage.setItem('munjizSettings', JSON.stringify(settings));
    }

    // ============================================
    // UTILITIES
    // ============================================

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #10b981;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    handleModalClick(e) {
        const productModal = document.getElementById('productModal');
        const orderModal = document.getElementById('orderModal');

        if (e.target === productModal) {
            this.closeProductModal();
        }
        if (e.target === orderModal) {
            this.closeOrderModal();
        }
    }

    async logout() {
        if (confirm('Are you sure you want to logout?')) {
            const result = await firebaseDB.signOut();
            if (result.success) {
                // Clear listeners
                firebaseDB.clearAllListeners();
                // Redirect to home
                window.location.href = 'index.html';
            } else {
                alert('Logout failed: ' + result.error);
            }
        }
    }

    // ============================================
    // EXTERNAL METHODS FOR TEMPLATES
    // ============================================

    editProduct(id) {
        this.openProductModal(id);
    }

    toggleProductVisibility(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            product.status = product.status === 'active' ? 'hidden' : 'active';
            this.saveData();
            this.renderProducts();
        }
    }

    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveData();
            this.renderProducts();
            this.showNotification('Product deleted successfully!');
        }
    }

    viewOrder(id) {
        this.viewOrder(id);
    }

    updateOrderStatus(id) {
        this.updateOrderStatus(id);
    }
}

// Initialize dashboard
const dashboard = new AdminDashboard();

// Add animation keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
