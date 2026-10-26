/* ==========================================================================
   THE HAMPER TELLS — Workshops Controller
   ========================================================================== */

let selectedWorkshop = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadWorkshops();
});

async function loadWorkshops() {
  const container = document.getElementById('workshopsGrid');
  if (!container) return;

  try {
    const data = await API.getWorkshops();
    const workshops = data.workshops || [];

    if (workshops.length === 0) {
      container.innerHTML = `<div class="col-12 text-center text-muted py-5">No active workshops scheduled right now.</div>`;
      return;
    }

    container.innerHTML = workshops.map(w => `
      <div class="col-md-6 mb-4">
        <div class="card border-0 shadow-sm rounded-3 overflow-hidden h-100">
          <img src="${w.image}" class="card-img-top" style="height: 240px; object-fit: cover;" alt="${w.title}">
          <div class="card-body p-4 d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-pink text-burgundy border px-3 py-1">${w.date}</span>
              <span class="fw-bold text-burgundy fs-5">${Main.formatPrice(w.price)} <small class="text-muted fs-7">/ person</small></span>
            </div>
            <h4 class="font-heading card-title mb-2">${w.title}</h4>
            <p class="text-muted fs-7 mb-3">${w.description}</p>
            
            <div class="mb-3 text-muted fs-7">
              <div class="mb-1"><i class="far fa-clock text-pink me-2"></i><strong>Time:</strong> ${w.time}</div>
              <div class="mb-1"><i class="fas fa-map-marker-alt text-pink me-2"></i><strong>Location:</strong> ${w.location}</div>
              <div><i class="fas fa-chair text-pink me-2"></i><strong>Seats Remaining:</strong> ${w.seatsLeft} left</div>
            </div>

            <div class="mt-auto">
              <h6 class="fs-7 text-uppercase tracking-wider text-muted mb-2">What's Included:</h6>
              <ul class="list-unstyled fs-7 mb-4">
                ${w.includes.map(inc => `<li><i class="fas fa-check text-pink me-2"></i>${inc}</li>`).join('')}
              </ul>
              <button class="btn btn-blush w-100" onclick="openBookingModal('${w._id}', '${w.title}', ${w.price}, ${w.seatsLeft})">
                Book Workshop Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = `<div class="col-12 text-danger text-center py-4">Failed to load workshops.</div>`;
  }
}

function openBookingModal(id, title, price, seats) {
  selectedWorkshop = { id, title, price, seats };
  document.getElementById('bookingWorkshopTitle').textContent = title;
  document.getElementById('bookingPriceText').textContent = Main.formatPrice(price);

  const user = API.getUser();
  if (user) {
    if (document.getElementById('bookingName')) document.getElementById('bookingName').value = user.name || '';
    if (document.getElementById('bookingEmail')) document.getElementById('bookingEmail').value = user.email || '';
    if (document.getElementById('bookingPhone')) document.getElementById('bookingPhone').value = user.phone || '';
  }

  const modal = new bootstrap.Modal(document.getElementById('workshopBookingModal'));
  modal.show();
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('workshopBookingForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!selectedWorkshop) return;

      const tickets = parseInt(document.getElementById('bookingTicketsSelect').value) || 1;
      const payload = {
        workshopId: selectedWorkshop.id,
        userName: document.getElementById('bookingName').value.trim(),
        userEmail: document.getElementById('bookingEmail').value.trim(),
        userPhone: document.getElementById('bookingPhone').value.trim(),
        tickets
      };

      try {
        const response = await API.bookWorkshop(payload);
        if (response.success) {
          bootstrap.Modal.getInstance(document.getElementById('workshopBookingModal'))?.hide();
          Main.showToast(`🎉 Workshop booked successfully for ${response.booking.tickets} ticket(s)!`);
          await loadWorkshops();
        }
      } catch (error) {
        Main.showToast(error.message || 'Booking failed', 'error');
      }
    });
  }
});
