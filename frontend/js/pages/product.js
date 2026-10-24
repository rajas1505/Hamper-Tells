/* ==========================================================================
   THE HAMPER TELLS — Product Details Controller
   ========================================================================== */

let currentProduct = null;

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    window.location.href = 'shop.html';
    return;
  }

  await loadProductDetails(productId);
});

async function loadProductDetails(id) {
  try {
    const data = await API.getProductById(id);
    if (!data.success || !data.product) {
      document.getElementById('productDetailContainer').innerHTML = `<div class="text-center py-5">Product not found.</div>`;
      return;
    }

    currentProduct = data.product;
    renderProductPage(currentProduct, data.relatedProducts || []);
  } catch (error) {
    console.error('Error loading product details:', error);
  }
}

function renderProductPage(product, related) {
  // Breadcrumb & Title
  const breadcrumbCat = document.getElementById('productBreadcrumbCategory');
  if (breadcrumbCat) {
    breadcrumbCat.textContent = product.category;
    breadcrumbCat.onclick = () => window.location.href = `shop.html?category=${encodeURIComponent(product.category)}`;
    breadcrumbCat.style.cursor = 'pointer';
  }
  document.getElementById('productBreadcrumbTitle').textContent = product.name;

  // Main Image
  const mainImg = document.getElementById('productMainImage');
  const defaultImg = (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600';
  if (mainImg) mainImg.src = defaultImg;

  // Thumbnails Gallery
  const thumbsContainer = document.getElementById('productThumbnailsContainer');
  if (thumbsContainer && product.images && product.images.length > 0) {
    thumbsContainer.innerHTML = product.images.map((imgUrl, idx) => `
      <img src="${imgUrl}" class="rounded border p-1 product-thumb ${idx === 0 ? 'border-burgundy' : ''}" 
           style="width: 72px; height: 72px; object-fit: cover; cursor: pointer; transition: all 0.2s;"
           onclick="selectProductImage('${imgUrl}', this)"
           alt="${product.name} view ${idx + 1}">
    `).join('');
  }

  // Badges & Info details
  document.getElementById('productTitle').textContent = product.name;
  document.getElementById('productCategoryBadge').textContent = product.category;
  
  const occasionBadge = document.getElementById('productOccasionBadge');
  if (occasionBadge) {
    occasionBadge.textContent = product.occasion || 'All Occasions';
  }

  const badgeOverlay = document.getElementById('productBadgeOverlay');
  if (badgeOverlay && product.isBestSeller) {
    badgeOverlay.textContent = '⭐ Best Seller';
    badgeOverlay.className = 'badge bg-burgundy text-white position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm fs-7';
  }

  document.getElementById('productPrice').textContent = Main.formatPrice(product.price);
  document.getElementById('productRatingText').innerHTML = `
    <span class="text-warning"><i class="fas fa-star"></i> ${product.rating}</span> 
    <span class="text-muted ms-1">(${product.reviewsCount} customer reviews)</span>
    <span class="mx-2 text-muted">•</span>
    <span class="text-success"><i class="fas fa-truck-fast me-1"></i> Ships tomorrow</span>
  `;
  document.getElementById('productDescription').textContent = product.description;

  // Dimensions & Care Tips
  const dimensionsEl = document.getElementById('productDimensionsText');
  if (dimensionsEl) {
    dimensionsEl.textContent = product.dimensions || 'Approx. 25cm x 20cm x 15cm (Standard Luxury Size)';
  }

  const careTipsEl = document.getElementById('productCareTipsText');
  if (careTipsEl) {
    careTipsEl.innerHTML = `<p class="mb-0"><i class="fas fa-info-circle text-pink me-2"></i>${product.careTips || 'Store in a clean, dry location at room temperature. Keep away from water and direct heat.'}</p>`;
  }

  const tabDescEl = document.getElementById('productTabDescription');
  if (tabDescEl) {
    tabDescEl.textContent = product.description;
  }

  const reviewOverviewCount = document.getElementById('productReviewOverviewCount');
  if (reviewOverviewCount) {
    reviewOverviewCount.textContent = `${product.rating} out of 5 based on ${product.reviewsCount} verified customer orders`;
  }

  // Included items list
  const includesList = document.getElementById('productIncludesList');
  if (includesList && product.includedItems && product.includedItems.length > 0) {
    includesList.innerHTML = product.includedItems.map(item => `
      <li class="py-1 d-flex align-items-center">
        <i class="fas fa-check-circle text-pink me-2"></i>
        <span>${item}</span>
      </li>
    `).join('');
  }

  // Setup Add to Cart button
  const addToCartBtn = document.getElementById('btnAddToCart');
  if (addToCartBtn) {
    addToCartBtn.onclick = () => {
      const qty = parseInt(document.getElementById('productQtyInput').value) || 1;
      const message = document.getElementById('giftMessageInput')?.value || '';
      CartStore.addItem(product, qty, message);

      const originalHtml = addToCartBtn.innerHTML;
      addToCartBtn.innerHTML = `<i class="fas fa-check me-2"></i> Added to Cart!`;
      addToCartBtn.classList.replace('btn-blush', 'btn-success');
      setTimeout(() => {
        addToCartBtn.innerHTML = originalHtml;
        addToCartBtn.classList.replace('btn-success', 'btn-blush');
      }, 1500);
    };
  }

  // Setup Buy Now button
  const buyNowBtn = document.getElementById('btnBuyNow');
  if (buyNowBtn) {
    buyNowBtn.onclick = () => {
      const qty = parseInt(document.getElementById('productQtyInput').value) || 1;
      const message = document.getElementById('giftMessageInput')?.value || '';
      CartStore.addItem(product, qty, message);
      window.location.href = 'checkout.html';
    };
  }

  // Render Related Products
  const relatedContainer = document.getElementById('relatedProductsContainer');
  if (relatedContainer && related.length > 0) {
    relatedContainer.innerHTML = related.map(p => `
      <div class="col-6 col-md-3 mb-4">
        <div class="product-card h-100">
          <div class="product-img-wrapper">
            <img src="${(p.images && p.images[0]) || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500'}" alt="${p.name}">
            ${p.isBestSeller ? `<span class="product-badge-tag">Best Seller</span>` : ''}
          </div>
          <div class="product-card-body d-flex flex-column">
            <span class="product-category-text">${p.category}</span>
            <h6 class="product-title"><a href="product.html?id=${p._id}">${p.name}</a></h6>
            <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
              <div class="product-price fs-6">${Main.formatPrice(p.price)}</div>
              <a href="product.html?id=${p._id}" class="btn btn-sm btn-outline-blush">View</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function selectProductImage(imgUrl, el) {
  const mainImg = document.getElementById('productMainImage');
  if (mainImg) mainImg.src = imgUrl;

  document.querySelectorAll('.product-thumb').forEach(thumb => {
    thumb.classList.remove('border-burgundy');
    thumb.style.borderColor = '#dee2e6';
  });
  if (el) {
    el.classList.add('border-burgundy');
    el.style.borderColor = 'var(--accent-burgundy)';
  }
}

function updateQty(change) {
  const input = document.getElementById('productQtyInput');
  if (!input) return;
  let val = parseInt(input.value) || 1;
  val = Math.max(1, val + change);
  input.value = val;
}
