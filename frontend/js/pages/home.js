/* ==========================================================================
   THE HAMPER TELLS — Home Page Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  await loadFeaturedHampers();
  await loadBestSellers();
});

async function loadFeaturedHampers() {
  const container = document.getElementById('featuredHampersContainer');
  if (!container) return;

  try {
    const data = await API.getProducts({ featured: 'true' });
    const products = data.products || [];

    if (products.length === 0) {
      container.innerHTML = `<div class="col-12 text-center text-muted py-4">No featured products found.</div>`;
      return;
    }

    container.innerHTML = products.slice(0, 4).map(product => createProductCardHtml(product)).join('');
  } catch (error) {
    console.error('Error loading featured hampers:', error);
    container.innerHTML = `<div class="col-12 text-center text-danger py-4">Unable to load featured gifts.</div>`;
  }
}

async function loadBestSellers() {
  const container = document.getElementById('bestSellersContainer');
  if (!container) return;

  try {
    const data = await API.getProducts({ bestSeller: 'true' });
    const products = data.products || [];

    if (products.length === 0) {
      container.innerHTML = `<div class="col-12 text-center text-muted py-4">No best sellers found.</div>`;
      return;
    }

    container.innerHTML = products.slice(0, 4).map(product => createProductCardHtml(product)).join('');
  } catch (error) {
    console.error('Error loading best sellers:', error);
  }
}

function createProductCardHtml(product) {
  const inWishlist = Main.isInWishlist(product._id);
  const heartClass = inWishlist ? 'fas text-danger' : 'far';

  return `
    <div class="col-6 col-lg-3 mb-4">
      <div class="product-card">
        <div class="product-img-wrapper">
          <img src="${product.images[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500'}" alt="${product.name}" loading="lazy">
          ${product.isBestSeller ? `<span class="product-badge-tag">Best Seller</span>` : ''}
          <button class="wishlist-btn-corner ${inWishlist ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlistClick('${product._id}', this)" title="Add to Wishlist">
            <i class="${heartClass} fa-heart"></i>
          </button>
        </div>
        <div class="product-card-body">
          <div class="product-category-text">${product.category}</div>
          <h5 class="product-title">
            <a href="product.html?id=${product._id}">${product.name}</a>
          </h5>
          <div class="product-rating">
            <i class="fas fa-star"></i> ${product.rating} <span class="text-muted fs-7">(${product.reviewsCount})</span>
          </div>
          <div class="mt-auto d-flex align-items-center justify-content-between pt-2">
            <div class="product-price">${Main.formatPrice(product.price)}</div>
            <button class="btn btn-blush btn-sm px-3" onclick="quickAddToCart('${product._id}')">
              <i class="fas fa-shopping-bag me-1"></i> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function quickAddToCart(productId) {
  try {
    const data = await API.getProductById(productId);
    if (data.success && data.product) {
      CartStore.addItem(data.product, 1);
    }
  } catch (error) {
    Main.showToast('Could not add product to cart', 'error');
  }
}

async function toggleWishlistClick(productId, btnElem) {
  try {
    const data = await API.getProductById(productId);
    if (data.success && data.product) {
      const isAdded = Main.toggleWishlist(data.product);
      const icon = btnElem.querySelector('i');
      if (isAdded) {
        icon.className = 'fas fa-heart text-danger';
        btnElem.classList.add('active');
      } else {
        icon.className = 'far fa-heart';
        btnElem.classList.remove('active');
      }
    }
  } catch (error) {
    console.error(error);
  }
}
