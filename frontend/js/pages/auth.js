/* ==========================================================================
   THE HAMPER TELLS — Authentication Controller (Login & Register)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  setupRegisterForm();
  setupLoginForm();
});

function setupRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
      Main.showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      Main.showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      const data = await API.register(name, email, phone, password);
      if (data.success && data.user) {
        API.setAuth(data.user, data.user.token);
        Main.showToast(`Welcome to The Hamper Tells, ${data.user.name}! 🌸`);
        setTimeout(() => window.location.href = 'index.html', 1000);
      }
    } catch (error) {
      Main.showToast(error.message || 'Registration failed', 'error');
    }
  });
}

function setupLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
      const data = await API.login(email, password);
      if (data.success && data.user) {
        API.setAuth(data.user, data.user.token);
        if (data.user.role === 'admin') {
          Main.showToast(`Welcome Store Admin, ${data.user.name}! 👑`);
          setTimeout(() => window.location.href = 'admin.html', 800);
        } else {
          Main.showToast(`Welcome back, ${data.user.name}! ✨`);
          setTimeout(() => window.location.href = 'index.html', 800);
        }
      }
    } catch (error) {
      Main.showToast(error.message || 'Invalid email or password', 'error');
    }
  });

  setupQuickCustomerEntryForm();
}

function setupQuickCustomerEntryForm() {
  const form = document.getElementById('quickEntryForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('quickName').value.trim();
    const phone = document.getElementById('quickPhone').value.trim();
    const email = document.getElementById('quickEmail') ? document.getElementById('quickEmail').value.trim() : '';
    const city = document.getElementById('quickCity') ? document.getElementById('quickCity').value.trim() : '';

    try {
      const data = await API.customerEntry(name, phone, email, city);
      if (data.success && data.user) {
        API.setAuth(data.user, data.user.token);
        Main.showToast(`Welcome to The Hamper Tells, ${data.user.name}! 🌸`);
        setTimeout(() => window.location.href = 'index.html', 800);
      }
    } catch (err) {
      Main.showToast(err.message || 'Could not verify details', 'error');
    }
  });
}

window.fillDemoCustomer = function(email = 'ananya@gmail.com', pass = 'password123') {
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  if (emailInput && passInput) {
    emailInput.value = email;
    passInput.value = pass;
    const form = document.getElementById('loginForm');
    if (form) form.dispatchEvent(new Event('submit'));
  }
};

function logoutUser() {
  API.clearAuth();
  Main.showToast('You have logged out');
  setTimeout(() => window.location.href = 'index.html', 800);
}
