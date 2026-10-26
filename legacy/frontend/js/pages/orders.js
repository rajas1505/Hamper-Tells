/* ==========================================================================
   THE HAMPER TELLS — Customer Orders & Tracking Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const trackId = urlParams.get('track') || urlParams.get('id');

  const user = API.getUser();
  if (!user) {
    // Show guest search or prompt to login
    document.getElementById('ordersListContainer').innerHTML = `
      <div class="bg-white p-4 rounded-3 border text-center shadow-sm">
        <div class="rounded-circle bg-pink d-inline-flex p-3 mb-2" style="background-color: var(--primary-blush);">
          <i class="fas fa-search-location text-burgundy fs-3"></i>
        </div>
        <h4 class="font-heading text-burgundy mb-2">Track Any Gift Order</h4>
        <p class="text-muted fs-7 mb-4">Enter your Order ID (e.g. HT-20261014-XXXX) to view live fulfillment progress:</p>
        <div class="row justify-content-center">
          <div class="col-md-7 col-lg-6">
            <form id="guestTrackForm" class="d-flex gap-2">
              <input type="text" id="guestOrderIdInput" class="form-control" placeholder="e.g. HT-20261014-6101" required>
              <button type="submit" class="btn btn-blush px-4">Track Order</button>
            </form>
          </div>
        </div>
        <hr class="my-4">
        <p class="text-muted fs-7 mb-0">Have an account? <a href="login.html" class="fw-semibold text-pink">Login to view all your past orders</a></p>
      </div>
    `;

    document.getElementById('guestTrackForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const orderId = document.getElementById('guestOrderIdInput').value.trim();
      await openOrderTrackerModal(orderId);
    });

    if (trackId) {
      document.getElementById('guestOrderIdInput').value = trackId;
      setTimeout(() => openOrderTrackerModal(trackId), 300);
    }
    return;
  }

  await loadMyOrders();

  if (trackId) {
    setTimeout(() => openOrderTrackerModal(trackId), 400);
  }
});

async function loadMyOrders() {
  const container = document.getElementById('ordersListContainer');
  if (!container) return;

  const user = API.getUser();

  try {
    const data = await API.getMyOrders();
    const orders = data.orders || [];

    const profileHeader = `
      <div class="bg-white p-3 p-md-4 rounded-3 border mb-4 shadow-sm d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
        <div class="d-flex align-items-center gap-3">
          <div class="rounded-circle bg-pink d-flex align-items-center justify-content-center text-burgundy fw-bold fs-4" style="width: 50px; height: 50px; background-color: var(--primary-blush);">
            ${(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h5 class="mb-0 font-heading text-burgundy">${user?.name || 'Customer Account'}</h5>
            <small class="text-muted"><i class="far fa-envelope me-1"></i>${user?.email || ''} • <i class="fas fa-phone me-1"></i>${user?.phone || 'Not set'}</small>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-danger btn-sm px-3" onclick="handleCustomerLogout()">
            <i class="fas fa-sign-out-alt me-1"></i> Logout
          </button>
        </div>
      </div>
    `;

    if (orders.length === 0) {
      container.innerHTML = `
        ${profileHeader}
        <div class="bg-white p-5 rounded-3 border text-center">
          <i class="fas fa-box-open text-muted fs-1 mb-3"></i>
          <h4 class="font-heading text-burgundy">No orders placed yet</h4>
          <p class="text-muted">Start creating memorable moments with our personalized gifts!</p>
          <a href="shop.html" class="btn btn-blush mt-2">Explore Shop</a>
        </div>
      `;
      return;
    }

    container.innerHTML = profileHeader + orders.map(order => `
      <div class="bg-white p-4 rounded-3 border mb-3 shadow-sm">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 border-bottom pb-3 mb-3">
          <div>
            <span class="badge bg-light text-dark border me-2">Order ID: ${order.orderId}</span>
            <span class="text-muted fs-7">Placed on ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div>
            <span class="badge bg-pink text-burgundy fw-semibold px-3 py-2" style="background-color: var(--primary-blush); border: 1px solid var(--border-subtle);">
              ${order.orderStatus}
            </span>
          </div>
        </div>

        <div class="row align-items-center">
          <div class="col-md-8">
            ${order.customHamper ? `
              <div class="d-flex align-items-center gap-3 mb-2">
                <i class="fas fa-gift text-pink fs-3"></i>
                <div>
                  <h6 class="mb-0 font-heading">Custom Hamper (${order.customHamper.baseBox.name})</h6>
                  <small class="text-muted">${order.customHamper.items.length} items included • Message: "${order.customHamper.personalMessage || 'None'}"</small>
                </div>
              </div>
            ` : ''}

            ${order.items.map(item => `
              <div class="d-flex align-items-center gap-3 mb-2">
                <img src="${item.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100'}" style="width: 50px; height: 50px; object-fit: cover;" class="rounded">
                <div>
                  <h6 class="mb-0 fs-7 font-heading">${item.name}</h6>
                  <small class="text-muted">Qty: ${item.quantity} • ${Main.formatPrice(item.price)}</small>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="col-md-4 text-md-end mt-3 mt-md-0">
            <div class="fs-5 fw-bold text-burgundy mb-2">${Main.formatPrice(order.totalAmount)}</div>
            <button class="btn btn-outline-blush btn-sm px-3" onclick="openOrderTrackerModal('${order._id}')">
              <i class="fas fa-shipping-fast me-1"></i> Track Order
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = `<div class="text-danger p-4 text-center">Failed to load orders.</div>`;
  }
}

async function openOrderTrackerModal(orderIdOrKey) {
  const modalEl = document.getElementById('orderTrackerModal');
  if (!modalEl) return;
  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  const dynamicBody = document.getElementById('modalTrackerDynamicBody');
  const orderIdText = document.getElementById('modalOrderIdText');
  
  if (dynamicBody) {
    dynamicBody.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-pink" role="status" style="color: var(--accent-rose);"></div>
        <p class="text-muted mt-2 fs-7">Fetching real-time fulfillment updates...</p>
      </div>
    `;
  }

  try {
    const data = await API.getOrderById(orderIdOrKey);
    if (!data.success || !data.order) {
      if (dynamicBody) {
        dynamicBody.innerHTML = `
          <div class="text-center py-4">
            <i class="fas fa-search-minus text-muted fs-1 mb-3"></i>
            <h5 class="text-burgundy">Order Not Found</h5>
            <p class="text-muted fs-7">We couldn't locate an order matching "${orderIdOrKey}". Please check your order ID number.</p>
          </div>
        `;
      }
      return;
    }

    const order = data.order;
    if (orderIdText) orderIdText.textContent = order.orderId;

    const stages = [
      { name: 'Order Placed', icon: 'fa-shopping-bag', desc: 'Order received & logged' },
      { name: 'Confirmed', icon: 'fa-check-circle', desc: 'Verified by studio' },
      { name: 'Preparing', icon: 'fa-hand-sparkles', desc: 'Handcrafting & packing' },
      { name: 'Packed', icon: 'fa-box-open', desc: 'Sealed with ribbon & card' },
      { name: 'Shipped', icon: 'fa-truck-fast', desc: 'Dispatched with courier' },
      { name: 'Delivered', icon: 'fa-gift', desc: 'Arrived at doorstep' }
    ];

    const currentIdx = stages.findIndex(s => s.name === order.orderStatus);
    const progressPercent = currentIdx === -1 ? 15 : Math.round(((currentIdx + 1) / stages.length) * 100);

    let statusBadgeClass = 'badge bg-warning text-dark';
    if (order.orderStatus === 'Delivered') statusBadgeClass = 'badge bg-success';
    else if (order.orderStatus === 'Shipped') statusBadgeClass = 'badge bg-primary';
    else if (order.orderStatus === 'Packed') statusBadgeClass = 'badge bg-info text-dark';
    else if (order.orderStatus === 'Cancelled') statusBadgeClass = 'badge bg-danger';

    let itemsHtml = '';
    if (order.customHamper) {
      itemsHtml += `
        <div class="p-3 bg-white rounded-3 border mb-2 shadow-sm">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <strong class="font-heading text-burgundy"><i class="fas fa-gift text-pink me-1"></i> Custom Hamper (${order.customHamper.baseBox?.name || 'Hamper'})</strong>
            <span class="fw-bold">${Main.formatPrice(order.customHamper.totalPrice)}</span>
          </div>
          <div class="fs-8 text-muted mb-1">Theme: ${order.customHamper.packagingTheme?.name} • Card: ${order.customHamper.greetingCard?.name}</div>
          <div class="fs-8 text-dark">Items: ${order.customHamper.items?.map(i => i.name).join(', ') || 'Custom Selection'}</div>
          ${order.customHamper.personalMessage ? `<div class="p-2 bg-light rounded mt-2 fs-8 fst-italic text-pink">"${order.customHamper.personalMessage}"</div>` : ''}
        </div>
      `;
    }

    if (order.items && order.items.length > 0) {
      itemsHtml += order.items.map(item => `
        <div class="d-flex align-items-center justify-content-between p-2 bg-white rounded border mb-2 fs-7">
          <div class="d-flex align-items-center gap-2">
            <img src="${item.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=80'}" style="width: 44px; height: 44px; object-fit: cover;" class="rounded border">
            <div>
              <div class="fw-semibold text-dark">${item.name}</div>
              <small class="text-muted">Qty: ${item.quantity} ${item.giftMessage ? `• Note: "${item.giftMessage}"` : ''}</small>
            </div>
          </div>
          <div class="fw-bold text-burgundy">${Main.formatPrice(item.price * item.quantity)}</div>
        </div>
      `).join('');
    }

    if (dynamicBody) {
      dynamicBody.innerHTML = `
        <!-- Top Status Banner -->
        <div class="bg-white p-3 rounded-3 border mb-3 shadow-sm d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <span class="text-muted fs-8 d-block">CURRENT STATUS</span>
            <span class="${statusBadgeClass} fs-6 px-3 py-1 rounded-pill">${order.orderStatus}</span>
          </div>
          <div>
            <span class="text-muted fs-8 d-block">ESTIMATED DELIVERY</span>
            <span class="fw-bold font-heading text-burgundy">${order.deliveryDate || 'Within 2-4 Days'}</span>
          </div>
          <div>
            <span class="text-muted fs-8 d-block">PAYMENT</span>
            <span class="badge ${order.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}">${order.paymentStatus} (${order.paymentMethod})</span>
          </div>
          <div>
            <span class="text-muted fs-8 d-block">ORDER TOTAL</span>
            <span class="fw-bold text-burgundy fs-5">${Main.formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="bg-white p-3 rounded-3 border mb-3 shadow-sm">
          <div class="d-flex justify-content-between align-items-center mb-2 fs-8 text-muted">
            <span>Fulfillment Progress</span>
            <span class="fw-bold text-burgundy">${progressPercent}% Completed</span>
          </div>
          <div class="progress" style="height: 8px;">
            <div class="progress-bar progress-bar-striped progress-bar-animated bg-pink" role="progressbar" 
                 style="width: ${progressPercent}%; background-color: var(--accent-burgundy) !important;" 
                 aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100"></div>
          </div>

          <!-- Step Indicators -->
          <div class="d-flex justify-content-between mt-3 text-center">
            ${stages.map((stg, i) => {
              const done = i <= currentIdx;
              const isCurrent = i === currentIdx;
              return `
                <div style="flex: 1;">
                  <div class="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-1" 
                       style="width: 32px; height: 32px; font-size: 0.8rem; background: ${done ? 'var(--accent-burgundy)' : '#e9ecef'}; color: ${done ? '#fff' : '#6c757d'}; ${isCurrent ? 'box-shadow: 0 0 0 4px rgba(128,0,32,0.2);' : ''}">
                    <i class="fas ${stg.icon}"></i>
                  </div>
                  <span class="d-block ${done ? 'fw-bold text-burgundy' : 'text-muted'}" style="font-size: 0.68rem;">${stg.name}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="row g-3">
          <!-- Delivery Address Column -->
          <div class="col-md-5">
            <div class="p-3 bg-white rounded-3 border h-100 shadow-sm">
              <h6 class="font-heading text-burgundy mb-2"><i class="fas fa-map-marker-alt text-pink me-1"></i> Delivery Details</h6>
              <div class="fs-7 text-dark mb-1"><strong>Recipient:</strong> ${order.customerName}</div>
              <div class="fs-7 text-dark mb-1"><strong>Phone:</strong> ${order.customerPhone}</div>
              <div class="fs-8 text-muted mt-2">
                <strong>Address:</strong><br>
                ${order.address?.houseNo || ''}, ${order.address?.street || ''}<br>
                ${order.address?.city || ''}, ${order.address?.state || ''} - ${order.address?.pinCode || ''}
              </div>
              ${order.deliveryInstructions ? `<div class="p-2 bg-light rounded mt-2 fs-8 text-muted"><em>Instructions: "${order.deliveryInstructions}"</em></div>` : ''}
            </div>
          </div>

          <!-- Items Summary Column -->
          <div class="col-md-7">
            <div class="p-3 bg-white rounded-3 border h-100 shadow-sm">
              <h6 class="font-heading text-burgundy mb-2"><i class="fas fa-boxes text-pink me-1"></i> Included Creations</h6>
              ${itemsHtml}
            </div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Tracker error:', error);
    if (dynamicBody) {
      dynamicBody.innerHTML = `<div class="text-danger text-center py-4">Failed to load order tracking details.</div>`;
    }
  }
}

function handleCustomerLogout() {
  if (confirm('Are you sure you want to log out?')) {
    API.clearAuth();
    Main.showToast('Logged out successfully');
    window.location.href = 'login.html';
  }
}

