/* ==========================================================================
   THE HAMPER TELLS — Checkout & Dynamic UPI QR Payment Controller
   ========================================================================== */

let pendingOrder = null;

document.addEventListener('DOMContentLoaded', () => {
  const cart = CartStore.getCart();
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  prefillUserData();
  renderCheckoutSummary();
  setupCheckoutForm();
  setupUpiModal();
});

function prefillUserData() {
  const user = API.getUser();
  if (user) {
    if (document.getElementById('checkoutName')) document.getElementById('checkoutName').value = user.name || '';
    if (document.getElementById('checkoutEmail')) document.getElementById('checkoutEmail').value = user.email || '';
    if (document.getElementById('checkoutPhone')) document.getElementById('checkoutPhone').value = user.phone || '';

    if (user.addresses && user.addresses.length > 0) {
      const addr = user.addresses[0];
      if (document.getElementById('houseNo')) document.getElementById('houseNo').value = addr.houseNo || '';
      if (document.getElementById('street')) document.getElementById('street').value = addr.street || '';
      if (document.getElementById('city')) document.getElementById('city').value = addr.city || '';
      if (document.getElementById('state')) document.getElementById('state').value = addr.state || '';
      if (document.getElementById('pinCode')) document.getElementById('pinCode').value = addr.pinCode || '';
    }
  }

  // Pre-fill min delivery date = tomorrow
  const datePicker = document.getElementById('deliveryDate');
  if (datePicker) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    datePicker.min = tomorrow.toISOString().split('T')[0];
    datePicker.value = tomorrow.toISOString().split('T')[0];
  }
}

function renderCheckoutSummary() {
  const cart = CartStore.getCart();
  const container = document.getElementById('checkoutItemsList');
  if (!container) return;

  container.innerHTML = cart.map(item => `
    <div class="d-flex justify-content-between align-items-center mb-2 fs-7">
      <div>
        <span class="fw-semibold">${item.name}</span>
        <span class="text-muted ms-1">x${item.quantity}</span>
      </div>
      <div class="fw-bold">${Main.formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('');

  const subtotal = CartStore.getSubtotal();
  const delivery = CartStore.getDeliveryCharge();
  const total = subtotal + delivery;

  document.getElementById('checkoutSubtotal').textContent = Main.formatPrice(subtotal);
  document.getElementById('checkoutDelivery').textContent = delivery === 0 ? 'FREE' : Main.formatPrice(delivery);
  document.getElementById('checkoutTotal').textContent = Main.formatPrice(total);
}

function setupCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('btnPlaceOrder');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Processing Order...`;

    const cart = CartStore.getCart();
    const standardItems = cart.filter(i => !i.isCustomHamper);
    const customHamperItem = cart.find(i => i.isCustomHamper);

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'UPI_QR';

    const orderPayload = {
      customerName: document.getElementById('checkoutName').value.trim(),
      customerEmail: document.getElementById('checkoutEmail').value.trim(),
      customerPhone: document.getElementById('checkoutPhone').value.trim(),
      items: standardItems,
      customHamper: customHamperItem ? customHamperItem.customHamperDetails : null,
      address: {
        houseNo: document.getElementById('houseNo').value.trim(),
        street: document.getElementById('street').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value.trim(),
        pinCode: document.getElementById('pinCode').value.trim()
      },
      deliveryDate: document.getElementById('deliveryDate').value,
      deliveryInstructions: document.getElementById('deliveryInstructions')?.value || '',
      paymentMethod
    };

    try {
      const response = await API.createOrder(orderPayload);
      if (response.success && response.order) {
        pendingOrder = response.order;

        if (paymentMethod === 'UPI_QR') {
          showUpiQrModal(pendingOrder);
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fas fa-check-circle me-2"></i> Place Order`;
        } else {
          CartStore.clearCart();
          localStorage.setItem('tht_last_order', JSON.stringify(response.order));
          window.location.href = `order-confirmation.html?id=${response.order.orderId}`;
        }
      } else {
        throw new Error(response.message || 'Order creation failed');
      }
    } catch (error) {
      Main.showToast(error.message || 'Failed to place order. Please try again.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fas fa-check-circle me-2"></i> Place Order`;
    }
  });
}

function showUpiQrModal(order) {
  document.getElementById('upiModalOrderId').textContent = order.orderId;
  document.getElementById('upiModalTotal').textContent = Main.formatPrice(order.totalAmount);

  // Construct standard UPI Pay URI string
  const upiVpa = 'thehampertells@upi';
  const merchantName = 'The Hamper Tells';
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(merchantName)}&am=${order.totalAmount}&cu=INR&tn=Order%20${encodeURIComponent(order.orderId)}`;

  // Generate dynamic QR image using api.qrserver.com
  const qrImg = document.getElementById('upiQrCodeImg');
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUri)}`;

  const alertBox = document.getElementById('upiStatusAlert');
  alertBox.style.display = 'none';

  const modal = new bootstrap.Modal(document.getElementById('upiQrModal'));
  modal.show();
}

function setupUpiModal() {
  const confirmBtn = document.getElementById('btnConfirmUpiPayment');
  if (!confirmBtn) return;

  confirmBtn.addEventListener('click', async () => {
    if (!pendingOrder) return;

    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Verifying UPI Payment...`;

    const alertBox = document.getElementById('upiStatusAlert');
    alertBox.className = 'alert alert-info fs-7 py-2';
    alertBox.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i> Confirming transaction with UPI gateway...`;
    alertBox.style.display = 'block';

    const txnRef = document.getElementById('upiTxnRefInput')?.value.trim() || 'UPI' + Date.now();

    try {
      // Simulate 1.5 sec verification
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = await API.verifyUpiPayment(pendingOrder.orderId, txnRef);
      if (response.success && response.order) {
        alertBox.className = 'alert alert-success fs-7 py-2';
        alertBox.innerHTML = `<i class="fas fa-check-circle me-2"></i> Payment Successful! Redirecting...`;
        
        CartStore.clearCart();
        localStorage.setItem('tht_last_order', JSON.stringify(response.order));
        
        setTimeout(() => {
          window.location.href = `order-confirmation.html?id=${response.order.orderId}`;
        }, 1200);
      } else {
        throw new Error(response.message || 'Payment verification failed');
      }
    } catch (error) {
      alertBox.className = 'alert alert-danger fs-7 py-2';
      alertBox.textContent = error.message || 'Payment verification failed. Please try again.';
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = `<i class="fas fa-check-circle me-2"></i> I Have Paid — Confirm Order`;
    }
  });
}
