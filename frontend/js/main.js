/* ==========================================================================
   THE HAMPER TELLS — Main Application Utilities & Global Navigation
   ========================================================================== */

const Main = {
  init() {
    this.updateNavAuth();
    this.updateCartBadge();
    this.checkCustomerGate();

    // Listen for cart changes
    window.addEventListener('cart-updated', () => {
      this.updateCartBadge();
    });

    // Global Search form handler
    const searchForm = document.getElementById('globalSearchForm');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('globalSearchInput');
        if (input && input.value.trim()) {
          window.location.href = `shop.html?search=${encodeURIComponent(input.value.trim())}`;
        }
      });
    }
  },

  // Update Cart Badge counter in navbar
  updateCartBadge() {
    const badge = document.getElementById('navCartBadge');
    if (badge) {
      const count = CartStore.getItemCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
      if (count > 0) {
        badge.classList.remove('pulse-bounce');
        void badge.offsetWidth; // trigger reflow
        badge.classList.add('pulse-bounce');
      }
    }
  },

  // Update Navbar based on Login status
  updateNavAuth() {
    const user = API.getUser();
    const accountLink = document.getElementById('navAccountLink');
    if (accountLink) {
      // Remove any existing logout button to avoid duplicates
      const oldLogout = document.getElementById('navLogoutBtn');
      if (oldLogout) oldLogout.remove();

      if (user) {
        if (user.role === 'admin') {
          accountLink.innerHTML = `<i class="fas fa-crown text-warning me-1"></i> Admin Panel`;
          accountLink.href = 'admin.html';
        } else {
          accountLink.innerHTML = `<i class="fas fa-user-circle me-1"></i> ${user.name.split(' ')[0]}`;
          accountLink.href = 'orders.html';
        }

        // Add Logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'navLogoutBtn';
        logoutBtn.className = 'btn btn-outline-danger btn-sm';
        logoutBtn.title = 'Sign Out';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        logoutBtn.onclick = () => Main.logout();
        accountLink.parentNode.insertBefore(logoutBtn, accountLink.nextSibling);
      } else {
        accountLink.innerHTML = `<i class="far fa-user me-1"></i> Login`;
        accountLink.href = 'login.html';
      }
    }
  },

  // User Logout helper
  logout() {
    API.clearAuth();
    sessionStorage.removeItem('tht_guest_pass');
    this.updateNavAuth();
    this.showToast('You have signed out successfully');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  },

  // Show luxury toast notification
  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(container);
    }

    const toastId = 'toast_' + Date.now();
    const toastHtml = `
      <div id="${toastId}" class="custom-toast d-flex align-items-center mb-2 fade-in">
        <i class="fas fa-sparkles text-warning me-3 fs-5"></i>
        <div class="flex-grow-1">${message}</div>
        <button type="button" class="btn-close btn-close-white ms-3" onclick="document.getElementById('${toastId}').remove()"></button>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHtml);

    setTimeout(() => {
      const elem = document.getElementById(toastId);
      if (elem) elem.remove();
    }, 4000);
  },

  // Format INR currency
  formatPrice(price) {
    return '₹' + Number(price).toLocaleString('en-IN');
  },

  // Wishlist Helpers
  getWishlist() {
    const w = localStorage.getItem('tht_wishlist');
    return w ? JSON.parse(w) : [];
  },

  toggleWishlist(product) {
    let wishlist = this.getWishlist();
    const index = wishlist.findIndex(item => item._id === product._id);
    let added = false;

    if (index > -1) {
      wishlist.splice(index, 1);
      this.showToast(`Removed "${product.name}" from Wishlist`);
    } else {
      wishlist.push(product);
      this.showToast(`Saved "${product.name}" to your Wishlist! 💖`);
      added = true;
    }

    localStorage.setItem('tht_wishlist', JSON.stringify(wishlist));
    return added;
  },

  isInWishlist(productId) {
    const wishlist = this.getWishlist();
    return wishlist.some(item => item._id === productId);
  },

  // Customer Welcome & Details Gate
  checkCustomerGate() {
    const path = window.location.pathname.toLowerCase();
    // Skip on admin portal, dedicated login or register pages
    if (path.includes('admin') || path.includes('login.html') || path.includes('register.html')) {
      return;
    }

    const user = API.getUser();
    const guestPass = sessionStorage.getItem('tht_guest_pass');
    if (user || guestPass) {
      return;
    }

    // Delay slightly to let page assets render smoothly
    setTimeout(() => {
      this.renderCustomerGateModal();
    }, 400);
  },

  renderCustomerGateModal() {
    if (document.getElementById('customerGateModal')) return;

    const modalHtml = `
      <div class="modal fade" id="customerGateModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="customerGateLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 480px;">
          <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-start">
              <div>
                <span class="badge bg-pink text-burgundy border px-3 py-1 mb-2">
                  <i class="fas fa-gift me-1"></i> Welcome to The Hamper Tells
                </span>
                <h4 class="font-heading text-burgundy mb-1" id="customerGateLabel">Enter Your Details</h4>
                <p class="text-muted fs-7 mb-0">Please share your details before browsing our handcrafted gifting collection.</p>
              </div>
            </div>

            <div class="modal-body px-4 py-3">
              <!-- Quick 1-Click Demo Option for Evaluators -->
              <div class="p-3 bg-light rounded-3 border mb-3 text-center">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="text-start">
                    <span class="fw-bold fs-7 text-burgundy d-block"><i class="fas fa-bolt text-warning me-1"></i> 1-Click Demo Entry</span>
                    <small class="text-muted fs-8">Instant login as Ananya Sharma</small>
                  </div>
                  <button type="button" class="btn btn-outline-dark btn-sm rounded-pill px-3 py-1 fs-7" onclick="Main.quickDemoLogin()">
                    Explore Now <i class="fas fa-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>

              <!-- Customer Details Form -->
              <form id="customerGateForm">
                <div class="mb-2">
                  <label class="form-label fs-7 fw-semibold text-muted mb-1">Your Full Name <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="far fa-user"></i></span>
                    <input type="text" id="gateCustomerName" class="form-control border-start-0" placeholder="e.g. Sahil Magadum" required>
                  </div>
                </div>

                <div class="mb-2">
                  <label class="form-label fs-7 fw-semibold text-muted mb-1">Mobile / WhatsApp Number <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted">+91</span>
                    <input type="tel" id="gateCustomerPhone" class="form-control border-start-0" placeholder="e.g. 9822012345" pattern="[0-9]{10}" title="10-digit mobile number" required>
                  </div>
                </div>

                <div class="row g-2 mb-3">
                  <div class="col-7">
                    <label class="form-label fs-7 fw-semibold text-muted mb-1">Email Address (Optional)</label>
                    <input type="email" id="gateCustomerEmail" class="form-control" placeholder="name@email.com">
                  </div>
                  <div class="col-5">
                    <label class="form-label fs-7 fw-semibold text-muted mb-1">City</label>
                    <input type="text" id="gateCustomerCity" class="form-control" placeholder="e.g. Belagavi">
                  </div>
                </div>

                <button type="submit" id="gateSubmitBtn" class="btn btn-blush w-100 py-2 fs-6 mb-2">
                  Enter Store & Start Gifting <i class="fas fa-sparkles ms-1"></i>
                </button>

                <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top fs-7">
                  <a href="login.html" class="text-muted"><i class="fas fa-sign-in-alt me-1"></i> Existing Login</a>
                  <a href="#" onclick="Main.skipCustomerGate(); return false;" class="text-muted">Browse as Guest <i class="fas fa-chevron-right ms-1"></i></a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const gateModalEl = document.getElementById('customerGateModal');
    const bsModal = new bootstrap.Modal(gateModalEl, {
      backdrop: 'static',
      keyboard: false
    });
    bsModal.show();

    // Form submission handler
    const form = document.getElementById('customerGateForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('gateSubmitBtn');
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Entering Store...`;

      const name = document.getElementById('gateCustomerName').value.trim();
      const phone = document.getElementById('gateCustomerPhone').value.trim();
      const email = document.getElementById('gateCustomerEmail').value.trim();
      const city = document.getElementById('gateCustomerCity').value.trim();

      try {
        const data = await API.customerEntry(name, phone, email, city);
        if (data.success && data.user) {
          API.setAuth(data.user, data.user.token);
          this.updateNavAuth();
          this.showToast(`Welcome to The Hamper Tells, ${data.user.name}! 🌸 Enjoy 10% off with code WELCOME10`);
          bsModal.hide();
        } else {
          throw new Error(data.message || 'Could not verify customer details');
        }
      } catch (err) {
        console.error('Customer gate error:', err);
        // Fallback: save local session so customer is never blocked
        const localUser = {
          name,
          phone,
          email: email || `${phone}@customer.thehampertells.com`,
          role: 'customer'
        };
        API.setAuth(localUser, 'local-token-' + Date.now());
        this.updateNavAuth();
        this.showToast(`Welcome, ${name}! 🌸`);
        bsModal.hide();
      }
    });
  },

  async quickDemoLogin() {
    try {
      const data = await API.login('ananya@gmail.com', 'password123');
      if (data.success && data.user) {
        API.setAuth(data.user, data.user.token);
        this.updateNavAuth();
        this.showToast(`Welcome back, ${data.user.name}! ✨`);
        const modalEl = document.getElementById('customerGateModal');
        if (modalEl) {
          const bsModal = bootstrap.Modal.getInstance(modalEl);
          if (bsModal) bsModal.hide();
        }
      }
    } catch (error) {
      console.warn('Demo login API fallback:', error);
      const demoUser = {
        name: 'Ananya Sharma',
        email: 'ananya@gmail.com',
        phone: '9822012345',
        role: 'customer'
      };
      API.setAuth(demoUser, 'demo-token');
      this.updateNavAuth();
      this.showToast('Logged in as Demo Customer (Ananya Sharma)');
      const modalEl = document.getElementById('customerGateModal');
      if (modalEl) {
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
      }
    }
  },

  skipCustomerGate() {
    sessionStorage.setItem('tht_guest_pass', '1');
    const modalEl = document.getElementById('customerGateModal');
    if (modalEl) {
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
    }
    this.showToast('Browsing as Guest. You can log in anytime from the top bar! 🌸');
  }
};

// Global Quick Add-to-Cart with visual tactile feedback
window.quickAddToCart = async function(productId, btnElem) {
  try {
    if (btnElem) {
      btnElem.disabled = true;
      btnElem.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`;
    }

    const data = await API.getProductById(productId);
    if (data.success && data.product) {
      CartStore.addItem(data.product, 1);
      
      if (btnElem) {
        btnElem.innerHTML = `<i class="fas fa-check me-1"></i> Added`;
        btnElem.classList.replace('btn-blush', 'btn-success');
        setTimeout(() => {
          btnElem.innerHTML = `<i class="fas fa-shopping-bag me-1"></i> Add`;
          btnElem.classList.replace('btn-success', 'btn-blush');
          btnElem.disabled = false;
        }, 1200);
      }
    } else {
      throw new Error('Product details unavailable');
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    Main.showToast('Could not add product to cart', 'error');
    if (btnElem) {
      btnElem.innerHTML = `<i class="fas fa-shopping-bag me-1"></i> Add`;
      btnElem.disabled = false;
    }
  }
};

// Global Wishlist Click Handler
window.toggleWishlistClick = async function(productId, btnElem) {
  try {
    const data = await API.getProductById(productId);
    if (data.success && data.product) {
      const isAdded = Main.toggleWishlist(data.product);
      if (btnElem) {
        const icon = btnElem.querySelector('i');
        if (isAdded) {
          if (icon) icon.className = 'fas fa-heart text-danger';
          btnElem.classList.add('active');
        } else {
          if (icon) icon.className = 'far fa-heart';
          btnElem.classList.remove('active');
        }
      }
    }
  } catch (error) {
    console.error('Wishlist error:', error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Main.init();
});

