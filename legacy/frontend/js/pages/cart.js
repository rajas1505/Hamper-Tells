/* ==========================================================================
   THE HAMPER TELLS — Shopping Cart Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  window.addEventListener('cart-updated', () => {
    renderCart();
  });
});

function renderCart() {
  const container = document.getElementById('cartItemsList');
  const summaryBox = document.getElementById('cartSummaryCard');
  if (!container) return;

  const cart = CartStore.getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5 bg-white rounded-3 border p-4">
        <i class="fas fa-shopping-basket text-pink fs-1 mb-3"></i>
        <h4 class="font-heading text-burgundy mb-2">Your hamper is waiting for something special.</h4>
        <p class="text-muted mb-4">Explore our luxury bouquets, hampers, or build your own custom gift!</p>
        <div class="d-flex justify-content-center gap-3">
          <a href="shop.html" class="btn btn-blush">Explore Shop</a>
          <a href="custom-hamper.html" class="btn btn-outline-blush">Build Custom Hamper</a>
        </div>
      </div>
    `;
    if (summaryBox) summaryBox.style.display = 'none';
    return;
  }

  if (summaryBox) summaryBox.style.display = 'block';

  container.innerHTML = cart.map(item => `
    <div class="cart-item-card p-3 bg-white rounded-3 border mb-3 shadow-sm d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
      <div class="d-flex align-items-center gap-3">
        <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover;" class="rounded-3">
        <div>
          <h6 class="mb-1 font-heading">${item.name}</h6>
          ${item.isCustomHamper ? `
            <small class="text-pink fw-semibold d-block">Custom Personalized Hamper</small>
            <small class="text-muted">${item.customHamperDetails?.items?.length || 0} items included</small>
          ` : `
            <small class="text-muted d-block">${Main.formatPrice(item.price)} each</small>
            ${item.giftMessage ? `<small class="text-italic text-pink d-block">"Message: ${item.giftMessage}"</small>` : ''}
          `}
        </div>
      </div>

      <div class="d-flex align-items-center gap-4">
        ${!item.isCustomHamper ? `
          <div class="input-group input-group-sm" style="width: 110px;">
            <button class="btn btn-outline-secondary" onclick="CartStore.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
            <input type="text" class="form-control text-center bg-white" value="${item.quantity}" readonly>
            <button class="btn btn-outline-secondary" onclick="CartStore.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
          </div>
        ` : `
          <span class="badge bg-light text-dark border">Qty: 1</span>
        `}

        <div class="text-end" style="min-width: 90px;">
          <div class="fw-bold text-burgundy">${Main.formatPrice(item.price * item.quantity)}</div>
        </div>

        <button class="btn btn-link text-danger p-0 ms-2" onclick="CartStore.removeItem('${item.id}')" title="Remove item">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  `).join('');

  updateCartSummary();
}

function updateCartSummary() {
  const subtotal = CartStore.getSubtotal();
  const delivery = CartStore.getDeliveryCharge();
  const total = subtotal + delivery;

  document.getElementById('cartSubtotalText').textContent = Main.formatPrice(subtotal);
  document.getElementById('cartDeliveryText').textContent = delivery === 0 ? 'FREE' : Main.formatPrice(delivery);
  document.getElementById('cartTotalText').textContent = Main.formatPrice(total);

  const freeShippingNotice = document.getElementById('freeShippingNotice');
  if (freeShippingNotice) {
    if (subtotal >= 1500) {
      freeShippingNotice.innerHTML = `<span class="text-success"><i class="fas fa-check-circle me-1"></i> You unlocked FREE Delivery!</span>`;
    } else {
      const remaining = 1500 - subtotal;
      freeShippingNotice.innerHTML = `<span class="text-muted">Add ${Main.formatPrice(remaining)} more for <strong>FREE Delivery</strong></span>`;
    }
  }
}
