/* ==========================================================================
   THE HAMPER TELLS — Signature Hamper Builder Controller
   ========================================================================== */

let hamperState = {
  step: 1,
  baseBox: { name: 'Medium Box', price: 299 },
  items: [],
  packagingTheme: { name: 'Blush Pink Theme', price: 99 },
  greetingCard: { name: 'Personalized Greeting Card', price: 49 },
  personalMessage: ''
};

document.addEventListener('DOMContentLoaded', () => {
  renderStep(hamperState.step);
  updatePriceSummary();
  setupListeners();
});

function setupListeners() {
  // Step Bar Click Navigation
  document.querySelectorAll('.builder-step-item').forEach(item => {
    item.addEventListener('click', function() {
      const stepNum = parseInt(this.dataset.step);
      goToStep(stepNum);
    });
  });

  // Base Box Selection Cards
  document.querySelectorAll('.base-box-card').forEach(card => {
    card.addEventListener('click', function() {
      document.querySelectorAll('.base-box-card').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      hamperState.baseBox = {
        name: this.dataset.name,
        price: Number(this.dataset.price)
      };
      updatePriceSummary();
    });
  });

  // Product Add/Remove Checkbox Cards
  document.querySelectorAll('.item-select-card').forEach(card => {
    card.addEventListener('click', function() {
      const name = this.dataset.name;
      const price = Number(this.dataset.price);

      const index = hamperState.items.findIndex(i => i.name === name);
      if (index > -1) {
        hamperState.items.splice(index, 1);
        this.classList.remove('selected');
      } else {
        hamperState.items.push({ name, price });
        this.classList.add('selected');
      }
      updatePriceSummary();
    });
  });

  // Packaging Theme Selection
  document.querySelectorAll('.theme-select-card').forEach(card => {
    card.addEventListener('click', function() {
      document.querySelectorAll('.theme-select-card').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      hamperState.packagingTheme = {
        name: this.dataset.name,
        price: Number(this.dataset.price)
      };
      updatePriceSummary();
    });
  });

  // Greeting Card Selection
  document.querySelectorAll('.card-select-card').forEach(card => {
    card.addEventListener('click', function() {
      document.querySelectorAll('.card-select-card').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      hamperState.greetingCard = {
        name: this.dataset.name,
        price: Number(this.dataset.price)
      };
      updatePriceSummary();
    });
  });

  // Personal Message Input with Char Counter
  const messageInput = document.getElementById('hamperMessageInput');
  const messageCharCount = document.getElementById('messageCharCount');
  if (messageInput) {
    messageInput.addEventListener('input', function() {
      hamperState.personalMessage = this.value;
      if (messageCharCount) {
        messageCharCount.textContent = `${this.value.length} / 250 characters`;
      }
      updatePriceSummary();
    });
  }

  // Add Custom Hamper to Cart Button
  const addToCartBtn = document.getElementById('btnAddHamperToCart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      hamperState.totalPrice = calculateTotal();
      CartStore.addCustomHamper(hamperState);
      window.location.href = 'cart.html';
    });
  }
}

function goToStep(stepNum) {
  hamperState.step = stepNum;
  renderStep(stepNum);
}

function nextStep() {
  if (hamperState.step < 6) {
    goToStep(hamperState.step + 1);
  }
}

function prevStep() {
  if (hamperState.step > 1) {
    goToStep(hamperState.step - 1);
  }
}

function renderStep(stepNum) {
  // Update Step Indicators
  document.querySelectorAll('.builder-step-item').forEach(item => {
    const s = parseInt(item.dataset.step);
    item.classList.remove('active', 'completed');
    if (s === stepNum) {
      item.classList.add('active');
    } else if (s < stepNum) {
      item.classList.add('completed');
    }
  });

  // Show/Hide Step Content Panels
  document.querySelectorAll('.builder-step-panel').forEach(panel => {
    panel.style.display = 'none';
  });
  const activePanel = document.getElementById(`stepPanel_${stepNum}`);
  if (activePanel) {
    activePanel.style.display = 'block';
  }

  // Prev/Next buttons
  const btnPrev = document.getElementById('btnBuilderPrev');
  const btnNext = document.getElementById('btnBuilderNext');
  const btnAdd = document.getElementById('btnAddHamperToCart');

  if (btnPrev) btnPrev.style.display = stepNum === 1 ? 'none' : 'inline-block';
  if (btnNext) btnNext.style.display = stepNum === 6 ? 'none' : 'inline-block';
  if (btnAdd) btnAdd.style.display = stepNum === 6 ? 'block' : 'none';

  if (stepNum === 6) {
    renderSummaryStep();
  }
}

function calculateTotal() {
  const base = hamperState.baseBox ? hamperState.baseBox.price : 0;
  const gifts = hamperState.items.reduce((sum, item) => sum + item.price, 0);
  const pkg = hamperState.packagingTheme ? hamperState.packagingTheme.price : 0;
  const card = hamperState.greetingCard ? hamperState.greetingCard.price : 0;
  return base + gifts + pkg + card;
}

function updatePriceSummary() {
  const total = calculateTotal();
  
  // Dynamic Total Displays
  document.querySelectorAll('.dynamic-hamper-total').forEach(elem => {
    elem.textContent = Main.formatPrice(total);
  });

  // Sidebar Summary List
  const listElem = document.getElementById('summaryBreakdownList');
  if (listElem) {
    let html = `
      <li class="d-flex justify-content-between mb-2 fs-7 text-brown">
        <span>Base: ${hamperState.baseBox.name}</span>
        <span>${Main.formatPrice(hamperState.baseBox.price)}</span>
      </li>
    `;

    if (hamperState.items.length > 0) {
      html += hamperState.items.map(item => `
        <li class="d-flex justify-content-between mb-1 fs-7 text-muted">
          <span>+ ${item.name}</span>
          <span>${Main.formatPrice(item.price)}</span>
        </li>
      `).join('');
    }

    if (hamperState.packagingTheme) {
      html += `
        <li class="d-flex justify-content-between mb-1 fs-7 text-muted">
          <span>Theme: ${hamperState.packagingTheme.name}</span>
          <span>${Main.formatPrice(hamperState.packagingTheme.price)}</span>
        </li>
      `;
    }

    if (hamperState.greetingCard) {
      html += `
        <li class="d-flex justify-content-between mb-1 fs-7 text-muted">
          <span>Card: ${hamperState.greetingCard.name}</span>
          <span>${Main.formatPrice(hamperState.greetingCard.price)}</span>
        </li>
      `;
    }

    listElem.innerHTML = html;
  }
}

function renderSummaryStep() {
  const summaryBox = document.getElementById('finalSummaryCard');
  if (!summaryBox) return;

  summaryBox.innerHTML = `
    <h5 class="font-heading text-burgundy mb-3">Your Personalized Custom Hamper</h5>
    <div class="row g-3">
      <div class="col-md-6">
        <p class="mb-1 text-muted fs-7">BASE SELECTION</p>
        <h6>${hamperState.baseBox.name} (${Main.formatPrice(hamperState.baseBox.price)})</h6>
      </div>
      <div class="col-md-6">
        <p class="mb-1 text-muted fs-7">PACKAGING THEME</p>
        <h6>${hamperState.packagingTheme.name} (${Main.formatPrice(hamperState.packagingTheme.price)})</h6>
      </div>
      <div class="col-12">
        <p class="mb-1 text-muted fs-7">SELECTED GIFTS & SURPRISES (${hamperState.items.length})</p>
        <div class="d-flex flex-wrap gap-2">
          ${hamperState.items.length > 0 
            ? hamperState.items.map(i => `<span class="badge bg-light text-dark border">${i.name} (${Main.formatPrice(i.price)})</span>`).join('') 
            : '<span class="text-muted fs-7">No additional gifts selected.</span>'}
        </div>
      </div>
      <div class="col-md-6">
        <p class="mb-1 text-muted fs-7">GREETING CARD</p>
        <h6>${hamperState.greetingCard.name} (${Main.formatPrice(hamperState.greetingCard.price)})</h6>
      </div>
      <div class="col-12">
        <p class="mb-1 text-muted fs-7">YOUR PERSONALIZED GIFT MESSAGE</p>
        <div class="p-3 bg-light rounded border italic">
          "${hamperState.personalMessage || 'No personal message added.'}"
        </div>
      </div>
    </div>
  `;
}
