/* ==========================================================================
   THE HAMPER TELLS — Wishlist Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderWishlist();
});

function renderWishlist() {
  const container = document.getElementById('wishlistContainer');
  if (!container) return;

  const wishlist = Main.getWishlist();

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5 bg-white rounded-3 border p-4">
        <i class="far fa-heart text-pink fs-1 mb-3"></i>
        <h4 class="font-heading text-burgundy mb-2">Save the gifts you love.</h4>
        <p class="text-muted mb-4">Click the heart icon on any bouquet or hamper to keep track of your favorite gifts!</p>
        <a href="shop.html" class="btn btn-blush">Explore Shop</a>
      </div>
    `;
    return;
  }

  container.innerHTML = wishlist.map(product => `
    <div class="col-6 col-md-4 col-lg-3 mb-4">
      <div class="product-card">
        <div class="product-img-wrapper">
          <img src="${product.images[0]}" alt="${product.name}">
          <button class="wishlist-btn-corner active" onclick="removeFromWishlistPage('${product._id}')" title="Remove from Wishlist">
            <i class="fas fa-heart text-danger"></i>
          </button>
        </div>
        <div class="product-card-body">
          <div class="product-category-text">${product.category}</div>
          <h5 class="product-title"><a href="product.html?id=${product._id}">${product.name}</a></h5>
          <div class="product-price mb-3">${Main.formatPrice(product.price)}</div>
          <button class="btn btn-blush w-100 btn-sm" onclick="moveWishlistItemToCart('${product._id}')">
            <i class="fas fa-shopping-bag me-1"></i> Move to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function removeFromWishlistPage(productId) {
  let wishlist = Main.getWishlist();
  wishlist = wishlist.filter(item => item._id !== productId);
  localStorage.setItem('tht_wishlist', JSON.stringify(wishlist));
  Main.showToast('Removed from wishlist');
  renderWishlist();
}

async function moveWishlistItemToCart(productId) {
  const wishlist = Main.getWishlist();
  const product = wishlist.find(p => p._id === productId);
  if (product) {
    CartStore.addItem(product, 1);
    removeFromWishlistPage(productId);
  }
}
