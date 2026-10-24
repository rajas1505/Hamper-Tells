/* ==========================================================================
   THE HAMPER TELLS — Admin Dashboard & Financial Management Controller
   ========================================================================== */

let monthlySalesChartInstance = null;
let orderStatusChartInstance = null;
let cachedExpenses = [];
let cachedOrders = [];

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Guard check: Require admin role
  const user = API.getUser();
  const token = API.getToken();

  if (!user || user.role !== 'admin' || !token) {
    window.location.href = 'admin-login.html';
    return;
  }

  // Display admin name
  const nameDisplay = document.getElementById('adminNameDisplay');
  if (nameDisplay && user.name) {
    nameDisplay.textContent = user.name;
  }

  // Set default expense date to today
  const expenseDateInput = document.getElementById('expenseDate');
  if (expenseDateInput) {
    expenseDateInput.value = new Date().toISOString().split('T')[0];
  }

  // Load initial data
  await loadDashboardAnalytics();
  await loadAdminOrders();
  await loadAdminCustomers();
  await loadAdminProducts();

  // Setup form listeners
  setupExpenseForm();
  setupProductForm();
  setupSearchListeners();

  // Tab switch listener to resize charts and refresh tab data
  document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(btn => {
    btn.addEventListener('shown.bs.tab', (e) => {
      const targetId = e.target.getAttribute('data-bs-target');
      if (targetId === '#tab-overview') {
        if (monthlySalesChartInstance) monthlySalesChartInstance.resize();
        if (orderStatusChartInstance) orderStatusChartInstance.resize();
      } else if (targetId === '#tab-orders') {
        loadAdminOrders();
      } else if (targetId === '#tab-customers') {
        loadAdminCustomers();
      } else if (targetId === '#tab-products') {
        loadAdminProducts();
      } else if (targetId === '#tab-financials') {
        loadAllExpenses();
      }
    });
  });
});

// =============================================================================
// 1. DASHBOARD ANALYTICS & CHARTS
// =============================================================================

async function loadDashboardAnalytics() {
  try {
    const data = await API.getAdminAnalytics();
    if (!data.success) return;

    const { metrics, monthlyData, statusCounts, recentOrders, recentExpenses } = data;

    // 1. Update KPI Cards
    document.getElementById('kpiTotalRevenue').textContent = Main.formatPrice(metrics.totalRevenue || 0);
    document.getElementById('kpiTotalLoss').textContent = Main.formatPrice(metrics.totalExpenses || 0);
    
    const profitElem = document.getElementById('kpiNetProfit');
    const netProfit = metrics.netProfit || 0;
    profitElem.textContent = Main.formatPrice(netProfit);
    if (netProfit < 0) {
      profitElem.className = 'font-heading text-danger mb-0 mt-1';
    } else {
      profitElem.className = 'font-heading text-burgundy mb-0 mt-1';
    }

    document.getElementById('kpiProfitMargin').textContent = `${metrics.profitMargin || 0}%`;
    document.getElementById('kpiTotalOrders').textContent = metrics.totalOrders || 0;
    document.getElementById('kpiDeliveredOrders').textContent = statusCounts['Delivered'] || 0;
    document.getElementById('overviewCustomerCount').textContent = metrics.totalCustomers || 0;
    document.getElementById('overviewProductCount').textContent = metrics.totalProducts || 0;

    // 2. Render Charts
    renderMonthlyChart(monthlyData || []);
    renderStatusChart(statusCounts || {});

    // 3. Render Overview Quick Tables
    renderRecentOrders(recentOrders || []);
    renderRecentExpenses(recentExpenses || []);

    // 4. Render Monthly Financials Statement Table
    renderMonthlyFinancialsTable(monthlyData || []);

    // 5. Cache and render all expenses list
    loadAllExpenses();
  } catch (error) {
    console.error('Error loading admin analytics:', error);
    Main.showToast('Failed to load dashboard metrics', 'error');
  }
}

function renderMonthlyChart(monthlyData) {
  const ctx = document.getElementById('monthlySalesLossChart');
  if (!ctx) return;

  if (monthlySalesChartInstance) {
    monthlySalesChartInstance.destroy();
  }

  const labels = monthlyData.map(m => m.label || m.monthKey);
  const revenueData = monthlyData.map(m => m.revenue);
  const expenseData = monthlyData.map(m => m.expenses);
  const profitData = monthlyData.map(m => m.netProfit);

  monthlySalesChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Monthly Gross Sales (₹)',
          data: revenueData,
          backgroundColor: 'rgba(40, 167, 69, 0.7)',
          borderColor: '#28a745',
          borderWidth: 1,
          borderRadius: 6,
          order: 2
        },
        {
          label: 'Expenses & Losses (₹)',
          data: expenseData,
          backgroundColor: 'rgba(220, 53, 69, 0.7)',
          borderColor: '#dc3545',
          borderWidth: 1,
          borderRadius: 6,
          order: 3
        },
        {
          label: 'Net Profit (₹)',
          data: profitData,
          type: 'line',
          borderColor: '#800020',
          backgroundColor: 'rgba(128, 0, 32, 0.1)',
          borderWidth: 3,
          tension: 0.3,
          fill: true,
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { family: 'Poppins', size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ₹${Number(context.raw).toLocaleString('en-IN')}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => '₹' + value.toLocaleString('en-IN')
          }
        }
      }
    }
  });
}

function renderStatusChart(statusCounts) {
  const ctx = document.getElementById('orderStatusChart');
  if (!ctx) return;

  if (orderStatusChartInstance) {
    orderStatusChartInstance.destroy();
  }

  const labels = Object.keys(statusCounts);
  const data = Object.values(statusCounts);

  orderStatusChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#6c757d', // Order Placed
          '#17a2b8', // Confirmed
          '#ffc107', // Preparing
          '#20c997', // Packed
          '#007bff', // Shipped
          '#28a745', // Delivered
          '#dc3545'  // Cancelled
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, font: { size: 11 } }
        }
      }
    }
  });
}

function renderRecentOrders(orders) {
  const tbody = document.getElementById('recentOrdersTableBody');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No orders placed yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><span class="fw-bold text-burgundy">${o.orderId}</span></td>
      <td>${o.customerName}</td>
      <td class="fw-semibold">${Main.formatPrice(o.totalAmount)}</td>
      <td>${getStatusBadge(o.orderStatus)}</td>
      <td>${new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
    </tr>
  `).join('');
}

function renderRecentExpenses(expenses) {
  const tbody = document.getElementById('recentExpensesTableBody');
  if (!tbody) return;

  if (expenses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">No cost entries logged.</td></tr>`;
    return;
  }

  tbody.innerHTML = expenses.map(e => `
    <tr>
      <td>${e.title}</td>
      <td><span class="badge bg-light text-dark border">${e.category}</span></td>
      <td class="fw-semibold text-danger">-${Main.formatPrice(e.amount)}</td>
      <td class="text-muted">${e.month}</td>
    </tr>
  `).join('');
}

// =============================================================================
// 2. FINANCIAL STATEMENTS & EXPENSE MANAGEMENT
// =============================================================================

function renderMonthlyFinancialsTable(monthlyData) {
  const tbody = document.getElementById('monthlySummaryTableBody');
  if (!tbody) return;

  if (monthlyData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No monthly records available.</td></tr>`;
    return;
  }

  tbody.innerHTML = monthlyData.slice().reverse().map(m => {
    const isProfitable = m.netProfit >= 0;
    const statusBadge = isProfitable
      ? `<span class="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1"><i class="fas fa-check-circle me-1"></i> Profitable</span>`
      : `<span class="badge bg-danger bg-opacity-10 text-danger border border-danger px-2 py-1"><i class="fas fa-exclamation-triangle me-1"></i> Net Loss</span>`;

    return `
      <tr>
        <td class="fw-bold font-heading text-burgundy fs-6">${m.label || m.monthKey}</td>
        <td><span class="badge bg-light text-dark border">${m.ordersCount} orders</span></td>
        <td class="fw-bold text-success">${Main.formatPrice(m.revenue)}</td>
        <td class="fw-bold text-danger">${Main.formatPrice(m.expenses)}</td>
        <td class="fw-bold ${isProfitable ? 'text-burgundy' : 'text-danger'} fs-6">${Main.formatPrice(m.netProfit)}</td>
        <td class="fw-semibold ${isProfitable ? 'text-success' : 'text-danger'}">${m.profitMargin}%</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  }).join('');
}

async function loadAllExpenses() {
  try {
    const data = await API.getAdminExpenses();
    if (data.success) {
      cachedExpenses = data.expenses || [];
      filterExpenseList();
    }
  } catch (error) {
    console.error('Error fetching expenses:', error);
  }
}

function filterExpenseList() {
  const categoryFilter = document.getElementById('expenseFilterCategory')?.value || 'All';
  const tbody = document.getElementById('allExpensesTableBody');
  if (!tbody) return;

  let filtered = cachedExpenses;
  if (categoryFilter !== 'All') {
    filtered = filtered.filter(e => e.category === categoryFilter);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No expenses recorded for this category.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(e => `
    <tr>
      <td>${new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
      <td class="fw-semibold">${e.title}</td>
      <td><span class="badge bg-light text-dark border">${e.category}</span></td>
      <td class="fw-bold text-danger">-${Main.formatPrice(e.amount)}</td>
      <td><code>${e.month}</code></td>
      <td class="text-muted fs-7">${e.notes || '—'}</td>
      <td>
        <button class="btn btn-outline-danger btn-sm py-0 px-2 fs-7" onclick="deleteExpenseEntry('${e._id}')" title="Delete record">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function setupExpenseForm() {
  const form = document.getElementById('recordExpenseForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSaveExpense');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Saving...`;

    const payload = {
      title: document.getElementById('expenseTitle').value.trim(),
      category: document.getElementById('expenseCategory').value,
      amount: Number(document.getElementById('expenseAmount').value),
      date: document.getElementById('expenseDate').value,
      notes: document.getElementById('expenseNotes').value.trim()
    };

    try {
      const res = await API.createAdminExpense(payload);
      if (res.success) {
        bootstrap.Modal.getInstance(document.getElementById('recordExpenseModal'))?.hide();
        form.reset();
        Main.showToast('Expense / loss recorded successfully! 📊');
        await loadDashboardAnalytics();
      }
    } catch (error) {
      Main.showToast(error.message || 'Failed to record expense', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = `Save Entry`;
    }
  });
}

async function deleteExpenseEntry(id) {
  if (!confirm('Are you sure you want to delete this expense record?')) return;
  try {
    const res = await API.deleteAdminExpense(id);
    if (res.success) {
      Main.showToast('Expense record removed');
      await loadDashboardAnalytics();
    }
  } catch (error) {
    Main.showToast('Failed to delete expense', 'error');
  }
}

// =============================================================================
// 3. ORDERS MANAGEMENT
// =============================================================================

async function loadAdminOrders() {
  const tbody = document.getElementById('ordersManagementTableBody');
  const countDisplay = document.getElementById('orderResultsCount');
  const statusFilter = document.getElementById('orderStatusFilter')?.value || 'All';
  const search = document.getElementById('orderSearchInput')?.value.trim() || '';

  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4"><div class="spinner-border text-burgundy spinner-border-sm me-2"></div> Loading orders...</td></tr>`;

  try {
    const data = await API.getAdminOrders({ status: statusFilter, search });
    if (data.success) {
      cachedOrders = data.orders || [];
      if (countDisplay) {
        countDisplay.textContent = `Showing ${cachedOrders.length} order(s)`;
      }

      if (cachedOrders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-5">No orders found matching filters.</td></tr>`;
        return;
      }

      tbody.innerHTML = cachedOrders.map(order => `
        <tr>
          <td>
            <span class="fw-bold text-burgundy">${order.orderId}</span>
            <div class="text-muted fs-7">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          </td>
          <td>
            <div class="fw-semibold">${order.customerName}</div>
            <small class="text-muted d-block">${order.customerPhone}</small>
            <small class="text-muted">${order.customerEmail}</small>
          </td>
          <td>
            ${order.customHamper ? `
              <span class="badge bg-pink text-burgundy border mb-1">Custom Hamper (${order.customHamper.baseBox?.name || 'Box'})</span>
              <div class="fs-7 text-muted">${order.customHamper.items?.length || 0} gifts + card</div>
            ` : ''}
            ${order.items && order.items.length > 0 ? `
              <div class="fs-7 text-dark">${order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</div>
            ` : ''}
          </td>
          <td>
            <span class="badge ${order.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}">${order.paymentStatus}</span>
            <div class="fs-7 text-muted mt-1">${order.paymentMethod}</div>
          </td>
          <td class="fw-bold text-burgundy fs-6">${Main.formatPrice(order.totalAmount)}</td>
          <td>
            <div class="fw-semibold text-dark">${order.deliveryDate}</div>
            <small class="text-muted">${order.address?.city || ''}</small>
          </td>
          <td>${getStatusBadge(order.orderStatus)}</td>
          <td>
            <select class="form-select form-select-sm" style="width: 140px;" onchange="changeOrderStatus('${order._id}', this.value)">
              <option value="Order Placed" ${order.orderStatus === 'Order Placed' ? 'selected' : ''}>Order Placed</option>
              <option value="Confirmed" ${order.orderStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Preparing" ${order.orderStatus === 'Preparing' ? 'selected' : ''}>Preparing</option>
              <option value="Packed" ${order.orderStatus === 'Packed' ? 'selected' : ''}>Packed</option>
              <option value="Shipped" ${order.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Delivered" ${order.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${order.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <button class="btn btn-outline-blush btn-sm py-1 px-2 fs-7" onclick="viewOrderDetails('${order._id}')">
              <i class="fas fa-eye me-1"></i> View
            </button>
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-danger py-4">Failed to load orders.</td></tr>`;
  }
}

async function changeOrderStatus(orderId, newStatus) {
  try {
    const res = await API.updateAdminOrderStatus(orderId, newStatus);
    if (res.success) {
      Main.showToast(`Order status updated to "${newStatus}"! ✨`);
      await loadDashboardAnalytics();
      await loadAdminOrders();
    }
  } catch (error) {
    Main.showToast('Failed to update status', 'error');
  }
}

function viewOrderDetails(orderId) {
  const order = cachedOrders.find(o => o._id === orderId);
  if (!order) return;

  document.getElementById('orderModalTitle').textContent = `Order Details: ${order.orderId}`;
  document.getElementById('orderModalSubtitle').textContent = `Placed on ${new Date(order.createdAt).toLocaleString('en-IN')}`;

  const body = document.getElementById('orderModalBody');
  body.innerHTML = `
    <div class="row g-4 mb-4">
      <div class="col-md-6">
        <h6 class="font-heading text-burgundy border-bottom pb-1">Customer & Delivery Info</h6>
        <div class="fs-7 text-dark mb-1"><strong>Name:</strong> ${order.customerName}</div>
        <div class="fs-7 text-dark mb-1"><strong>Phone:</strong> ${order.customerPhone}</div>
        <div class="fs-7 text-dark mb-1"><strong>Email:</strong> ${order.customerEmail}</div>
        <div class="fs-7 text-dark mb-1"><strong>Target Date:</strong> ${order.deliveryDate}</div>
        <div class="fs-7 text-muted mt-2">
          <strong>Address:</strong><br>
          ${order.address?.houseNo}, ${order.address?.street}<br>
          ${order.address?.city}, ${order.address?.state} - ${order.address?.pinCode}
        </div>
        ${order.deliveryInstructions ? `<div class="p-2 bg-light rounded mt-2 fs-7"><em>Note: "${order.deliveryInstructions}"</em></div>` : ''}
      </div>

      <div class="col-md-6">
        <h6 class="font-heading text-burgundy border-bottom pb-1">Financial Summary</h6>
        <div class="d-flex justify-content-between fs-7 mb-1"><span>Subtotal:</span><span>${Main.formatPrice(order.subtotal)}</span></div>
        <div class="d-flex justify-content-between fs-7 mb-1"><span>Delivery Fee:</span><span>${Main.formatPrice(order.deliveryCharge)}</span></div>
        <div class="d-flex justify-content-between fs-7 mb-1"><span>Discount:</span><span>-${Main.formatPrice(order.discount || 0)}</span></div>
        <hr class="my-2">
        <div class="d-flex justify-content-between fw-bold fs-6 text-burgundy">
          <span>Final Total:</span>
          <span>${Main.formatPrice(order.totalAmount)}</span>
        </div>
        <div class="mt-3 p-2 bg-light rounded border fs-7">
          <div><strong>Payment Method:</strong> ${order.paymentMethod}</div>
          <div><strong>Payment Status:</strong> <span class="badge ${order.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}">${order.paymentStatus}</span></div>
        </div>
      </div>
    </div>

    <!-- Items List -->
    <h6 class="font-heading text-burgundy border-bottom pb-1 mb-3">Order Items</h6>
    ${order.customHamper ? `
      <div class="p-3 bg-light rounded-3 border mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <strong class="text-burgundy"><i class="fas fa-gift text-pink me-1"></i> Custom Hamper (${order.customHamper.baseBox?.name})</strong>
          <span class="fw-bold">${Main.formatPrice(order.customHamper.totalPrice)}</span>
        </div>
        <div class="fs-7 text-muted mb-1">Theme: ${order.customHamper.packagingTheme?.name} | Card: ${order.customHamper.greetingCard?.name}</div>
        <div class="fs-7 text-dark mb-2">Items: ${order.customHamper.items?.map(i => `${i.name} (₹${i.price})`).join(', ') || 'Base only'}</div>
        ${order.customHamper.personalMessage ? `<div class="p-2 bg-white rounded border fs-7 fst-italic">"Message: ${order.customHamper.personalMessage}"</div>` : ''}
      </div>
    ` : ''}

    ${order.items && order.items.length > 0 ? `
      <ul class="list-group list-group-flush mb-3 fs-7">
        ${order.items.map(item => `
          <li class="list-group-item d-flex justify-content-between align-items-center px-0">
            <div>
              <strong>${item.name}</strong> x${item.quantity}
              ${item.giftMessage ? `<div class="text-muted fst-italic fs-7">Gift note: "${item.giftMessage}"</div>` : ''}
            </div>
            <span class="fw-semibold">${Main.formatPrice(item.price * item.quantity)}</span>
          </li>
        `).join('')}
      </ul>
    ` : ''}

    <!-- Timeline Tracker -->
    <h6 class="font-heading text-burgundy border-bottom pb-1 mb-3">Fulfillment Timeline</h6>
    <ul class="timeline-list">
      ${order.timeline ? order.timeline.map(t => `
        <li class="timeline-item ${t.completed ? 'completed' : ''}">
          <div class="timeline-dot"></div>
          <div class="fw-semibold ${t.completed ? 'text-burgundy' : 'text-muted'}">${t.status} — ${t.label}</div>
          <small class="text-muted">${new Date(t.timestamp).toLocaleString('en-IN')}</small>
        </li>
      `).join('') : '<li class="text-muted fs-7">No timeline events recorded.</li>'}
    </ul>
  `;

  const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
  modal.show();
}

// =============================================================================
// 4. CUSTOMER ACCOUNTS DIRECTORY ("all the login for the customers too")
// =============================================================================

async function loadAdminCustomers() {
  const tbody = document.getElementById('customersTableBody');
  const badge = document.getElementById('totalCustomerBadge');
  if (!tbody) return;

  try {
    const data = await API.getAdminCustomers();
    if (data.success) {
      const customers = data.customers || [];
      if (badge) badge.textContent = `${customers.length} Customer Account(s) Registered`;

      if (customers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No customers registered yet.</td></tr>`;
        return;
      }

      tbody.innerHTML = customers.map((c, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>
            <div class="fw-bold font-heading text-burgundy">${c.name}</div>
            <small class="text-muted">ID: ${c._id.slice(-6)}</small>
          </td>
          <td>
            <code>${c.email}</code>
          </td>
          <td>${c.phone || '—'}</td>
          <td>${new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
          <td><span class="badge bg-light text-dark border">${c.totalOrders} order(s)</span></td>
          <td class="fw-bold text-success">${Main.formatPrice(c.totalSpent)}</td>
          <td>
            <span class="badge bg-success bg-opacity-10 text-success border border-success">
              <i class="fas fa-check-circle me-1"></i> Active Shopper
            </span>
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger py-4">Failed to load customer accounts.</td></tr>`;
  }
}

// =============================================================================
// 5. PRODUCT CATALOG MANAGEMENT
// =============================================================================

async function loadAdminProducts() {
  const tbody = document.getElementById('productsAdminTableBody');
  if (!tbody) return;

  try {
    const data = await API.getProducts({});
    if (data.success) {
      const products = data.products || [];

      if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No products in catalog.</td></tr>`;
        return;
      }

      tbody.innerHTML = products.map(p => `
        <tr>
          <td>
            <img src="${p.images[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100'}" class="rounded shadow-sm" style="width: 50px; height: 50px; object-fit: cover;">
          </td>
          <td>
            <div class="fw-bold text-dark">${p.name}</div>
            ${p.isBestSeller ? '<span class="badge bg-pink text-burgundy border fs-7">Best Seller</span>' : ''}
            ${p.isFeatured ? '<span class="badge bg-light text-dark border fs-7">Featured</span>' : ''}
          </td>
          <td>${p.category}</td>
          <td>${p.occasion}</td>
          <td class="fw-bold text-burgundy">${Main.formatPrice(p.price)}</td>
          <td>
            <span class="badge ${p.stock > 10 ? 'bg-success' : 'bg-warning text-dark'}">${p.stock} units</span>
          </td>
          <td><i class="fas fa-star text-warning"></i> ${p.rating} (${p.reviewsCount})</td>
          <td>
            <button class="btn btn-outline-danger btn-sm py-1 px-2 fs-7" onclick="deleteProductItem('${p._id}')" title="Delete Product">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger py-4">Failed to load products.</td></tr>`;
  }
}

function setupProductForm() {
  const form = document.getElementById('addNewProductForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSaveProduct');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Creating...`;

    const payload = {
      name: document.getElementById('newProdName').value.trim(),
      price: Number(document.getElementById('newProdPrice').value),
      category: document.getElementById('newProdCategory').value,
      occasion: document.getElementById('newProdOccasion').value,
      images: [document.getElementById('newProdImage').value.trim()],
      stock: Number(document.getElementById('newProdStock').value),
      description: document.getElementById('newProdDesc').value.trim(),
      isFeatured: document.getElementById('newProdFeatured').checked,
      isBestSeller: false
    };

    try {
      const res = await API.createAdminProduct(payload);
      if (res.success) {
        bootstrap.Modal.getInstance(document.getElementById('addProductModal'))?.hide();
        form.reset();
        Main.showToast('New gift product added to catalog! 🌸');
        await loadAdminProducts();
        await loadDashboardAnalytics();
      }
    } catch (error) {
      Main.showToast(error.message || 'Failed to add product', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = `Create Product`;
    }
  });
}

async function deleteProductItem(id) {
  if (!confirm('Are you sure you want to remove this product from store?')) return;
  try {
    const res = await API.deleteAdminProduct(id);
    if (res.success) {
      Main.showToast('Product removed from catalog');
      await loadAdminProducts();
      await loadDashboardAnalytics();
    }
  } catch (error) {
    Main.showToast('Failed to delete product', 'error');
  }
}

// =============================================================================
// 6. UTILITY FUNCTIONS
// =============================================================================

function setupSearchListeners() {
  const searchInput = document.getElementById('orderSearchInput');
  if (searchInput) {
    let timeout = null;
    searchInput.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        loadAdminOrders();
      }, 400);
    });
  }
}

function getStatusBadge(status) {
  const map = {
    'Order Placed': 'badge-status-placed',
    'Confirmed': 'badge-status-packed',
    'Preparing': 'badge-status-preparing',
    'Packed': 'badge-status-packed',
    'Shipped': 'badge-status-shipped',
    'Delivered': 'badge-status-delivered',
    'Cancelled': 'badge-status-cancelled'
  };
  const cls = map[status] || 'badge-status-placed';
  return `<span class="badge-status ${cls}">${status}</span>`;
}

function logoutAdmin() {
  API.clearAuth();
  Main.showToast('Logged out from Admin Dashboard');
  setTimeout(() => {
    window.location.href = 'admin-login.html';
  }, 600);
}
