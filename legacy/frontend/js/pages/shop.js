/* ==========================================================================
   THE HAMPER TELLS — Shop Listing Controller
   ========================================================================== */

let currentFilters = {
  category: 'All',
  occasion: 'All',
  minPrice: 0,
  maxPrice: 5000,
  search: '',
  sort: 'newest'
};

document.addEventListener('DOMContentLoaded', async () => {
  // Parse URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('category')) currentFilters.category = urlParams.get('category');
  if (urlParams.has('occasion')) currentFilters.occasion = urlParams.get('occasion');
  if (urlParams.has('search')) currentFilters.search = urlParams.get('search');

  // Pre-fill Search input
  const searchInput = document.getElementById('shopSearchInput');
  if (searchInput && currentFilters.search) {
    searchInput.value = currentFilters.search;
  }

  // Sync category active state from URL
  if (currentFilters.category && currentFilters.category !== 'All') {
    document.querySelectorAll('.category-filter-btn').forEach(b => {
      b.classList.remove('active');
      if (b.dataset.category.toLowerCase() === currentFilters.category.toLowerCase()) {
        b.classList.add('active');
      }
    });
  }

  // Sync occasion select from URL
  const occasionSelect = document.getElementById('occasionSelect');
  if (occasionSelect && currentFilters.occasion) {
    occasionSelect.value = currentFilters.occasion;
  }

  setupEventListeners();
  await fetchAndRenderProducts();
});

function setupEventListeners() {
  // Search Form Submit
  const searchForm = document.getElementById('shopSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = document.getElementById('shopSearchInput').value.trim();
      currentFilters.search = val;
      fetchAndRenderProducts();
    });
  }

  // Category Filter Radio/Click
  document.querySelectorAll('.category-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilters.category = this.dataset.category;
      fetchAndRenderProducts();
    });
  });

  // Occasion Filter
  const occasionSelect = document.getElementById('occasionSelect');
  if (occasionSelect) {
    occasionSelect.addEventListener('change', (e) => {
      currentFilters.occasion = e.target.value;
      fetchAndRenderProducts();
    });
  }

  // Sort Option
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      fetchAndRenderProducts();
    });
  }

  // Price Range Slider
  const priceRange = document.getElementById('priceRangeSlider');
  const priceValueDisplay = document.getElementById('priceValueDisplay');
  if (priceRange) {
    priceRange.addEventListener('input', (e) => {
      currentFilters.maxPrice = e.target.value;
      if (priceValueDisplay) priceValueDisplay.textContent = `Up to ₹${e.target.value}`;
    });
    priceRange.addEventListener('change', () => {
      fetchAndRenderProducts();
    });
  }
}

async function fetchAndRenderProducts() {
  const container = document.getElementById('shopProductsGrid');
  const countDisplay = document.getElementById('productCountDisplay');
  if (!container) return;

  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-pink" role="status" style="color: var(--accent-rose)">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted mt-2">Crafting your catalog...</p>
    </div>
  `;

  try {
    const data = await API.getProducts(currentFilters);
    const products = data.products || [];

    if (countDisplay) {
      countDisplay.textContent = `Showing ${products.length} gifting creation${products.length !== 1 ? 's' : ''}`;
    }

    if (products.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-gift text-muted fs-1 mb-3"></i>
          <h4>No gifts found</h4>
          <p class="text-muted">Try adjusting your search terms or filters.</p>
          <button class="btn btn-outline-blush mt-2" onclick="resetFilters()">Clear Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(product => `
      <div class="col-6 col-md-4 col-lg-4 mb-4">
        <div class="product-card">
          <div class="product-img-wrapper">
            <img src="${product.images[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500'}" alt="${product.name}" loading="lazy">
            ${product.isBestSeller ? `<span class="product-badge-tag">Best Seller</span>` : ''}
            <button class="wishlist-btn-corner ${Main.isInWishlist(product._id) ? 'active' : ''}" onclick="toggleWishlistClick('${product._id}', this)" title="Add to Wishlist">
              <i class="${Main.isInWishlist(product._id) ? 'fas text-danger' : 'far'} fa-heart"></i>
            </button>
          </div>
          <div class="product-card-body">
            <div class="product-category-text">${product.category} • ${product.occasion}</div>
            <h5 class="product-title">
              <a href="product.html?id=${product._id}">${product.name}</a>
            </h5>
            <div class="product-rating">
              <i class="fas fa-star"></i> ${product.rating} <span class="text-muted fs-7">(${product.reviewsCount})</span>
            </div>
            <div class="mt-auto d-flex align-items-center justify-content-between pt-2">
              <div class="product-price">${Main.formatPrice(product.price)}</div>
              <button class="btn btn-blush btn-sm px-3" onclick="quickAddToCart('${product._id}', this)">
                <i class="fas fa-shopping-bag me-1"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = `<div class="col-12 text-center text-danger py-4">Error loading products.</div>`;
  }
}

function resetFilters() {
  currentFilters = {
    category: 'All',
    occasion: 'All',
    minPrice: 0,
    maxPrice: 5000,
    search: '',
    sort: 'newest'
  };
  const searchInput = document.getElementById('shopSearchInput');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.category-filter-btn[data-category="All"]')?.classList.add('active');
  fetchAndRenderProducts();
}
