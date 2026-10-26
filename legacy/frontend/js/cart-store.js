/* ==========================================================================
   THE HAMPER TELLS — Unified Cart State Store
   ========================================================================== */

const CartStore = {
  getCart() {
    const cart = localStorage.getItem('tht_cart');
    return cart ? JSON.parse(cart) : [];
  },

  saveCart(cart) {
    localStorage.setItem('tht_cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
  },

  // Add standard product to cart
  addItem(product, quantity = 1, giftMessage = '', customizationDetails = '') {
    const cart = this.getCart();
    
    // Check existing item
    const existingIndex = cart.findIndex(item => item.product === product._id && !item.isCustomHamper);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += Number(quantity);
      if (giftMessage) cart[existingIndex].giftMessage = giftMessage;
      if (customizationDetails) cart[existingIndex].customizationDetails = customizationDetails;
    } else {
      const imgUrl = (Array.isArray(product.images) && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500';
      cart.push({
        id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
        product: product._id,
        name: product.name,
        price: product.price,
        image: imgUrl,
        quantity: Number(quantity),
        giftMessage: giftMessage || '',
        customizationDetails: customizationDetails || '',
        isCustomHamper: false
      });
    }

    this.saveCart(cart);
    Main.showToast(`Added "${product.name}" to your cart! 🌸`);
  },

  // Add custom hamper bundle to cart
  addCustomHamper(customHamperObj) {
    const cart = this.getCart();
    
    cart.push({
      id: 'hamper_' + Date.now(),
      name: `Custom Hamper (${customHamperObj.baseBox.name})`,
      price: customHamperObj.totalPrice,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500',
      quantity: 1,
      isCustomHamper: true,
      customHamperDetails: customHamperObj
    });

    this.saveCart(cart);
    Main.showToast('Your custom hamper has been added to cart! ✨');
  },

  // Update item quantity
  updateQuantity(cartItemId, newQuantity) {
    let cart = this.getCart();
    if (newQuantity <= 0) {
      cart = cart.filter(item => item.id !== cartItemId);
    } else {
      const item = cart.find(item => item.id === cartItemId);
      if (item) item.quantity = newQuantity;
    }
    this.saveCart(cart);
  },

  // Remove item
  removeItem(cartItemId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== cartItemId);
    this.saveCart(cart);
    Main.showToast('Item removed from cart');
  },

  // Clear cart
  clearCart() {
    localStorage.removeItem('tht_cart');
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: [] }));
  },

  // Calculate Subtotal
  getSubtotal() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  // Calculate Delivery Fee (Free shipping over ₹1500)
  getDeliveryCharge() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 1500 ? 0 : 99;
  },

  // Get Total Item Count
  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }
};
