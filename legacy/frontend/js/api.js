/* ==========================================================================
   THE HAMPER TELLS — REST API Client Helper
   ========================================================================== */

const API_BASE_URL = window.location.origin + '/api';

const API = {
  // Helper to fetch token from localStorage
  getToken() {
    return localStorage.getItem('tht_auth_token') || null;
  },

  // Helper to get stored user
  getUser() {
    const u = localStorage.getItem('tht_user');
    return u ? JSON.parse(u) : null;
  },

  // Set user & token
  setAuth(user, token) {
    localStorage.setItem('tht_auth_token', token);
    localStorage.setItem('tht_user', JSON.stringify(user));
  },

  // Clear auth
  clearAuth() {
    localStorage.removeItem('tht_auth_token');
    localStorage.removeItem('tht_user');
  },

  // Base HTTP Request Wrapper
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }
  },

  /* Auth Endpoints */
  async register(name, email, phone, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password })
    });
  },

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async customerEntry(name, phone, email = '', city = '') {
    return this.request('/auth/customer-entry', {
      method: 'POST',
      body: JSON.stringify({ name, phone, email, city })
    });
  },

  async getProfile() {
    return this.request('/auth/profile');
  },

  /* Product Endpoints */
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/products${queryString ? '?' + queryString : ''}`;
    return this.request(endpoint);
  },

  async getProductById(id) {
    return this.request(`/products/${id}`);
  },

  async getCategories() {
    return this.request('/products/categories');
  },

  /* Order Endpoints */
  async createOrder(orderPayload) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload)
    });
  },

  async getMyOrders() {
    return this.request('/orders/myorders');
  },

  async getOrderById(id) {
    return this.request(`/orders/${id}`);
  },

  async verifyUpiPayment(orderId, txnRef = '') {
    return this.request(`/orders/${orderId}/pay`, {
      method: 'POST',
      body: JSON.stringify({ txnRef })
    });
  },

  /* Workshop Endpoints */
  async getWorkshops() {
    return this.request('/workshops');
  },

  async bookWorkshop(bookingData) {
    return this.request('/workshops/book', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },

  /* Admin Endpoints */
  async adminLogin(email, password) {
    return this.request('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async getAdminAnalytics() {
    return this.request('/admin/analytics');
  },

  async getAdminOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/orders${queryString ? '?' + queryString : ''}`);
  },

  async updateAdminOrderStatus(orderId, orderStatus, note = '') {
    return this.request(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus, note })
    });
  },

  async getAdminCustomers() {
    return this.request('/admin/customers');
  },

  async getAdminExpenses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/expenses${queryString ? '?' + queryString : ''}`);
  },

  async createAdminExpense(expenseData) {
    return this.request('/admin/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData)
    });
  },

  async deleteAdminExpense(id) {
    return this.request(`/admin/expenses/${id}`, {
      method: 'DELETE'
    });
  },

  async createAdminProduct(productData) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async deleteAdminProduct(id) {
    return this.request(`/admin/products/${id}`, {
      method: 'DELETE'
    });
  }
};
