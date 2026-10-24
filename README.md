# THE HAMPER TELLS — Personalized Gifting Store & Custom Hamper Builder

> **TY CSE Diploma Final-Year Project Presentation**

A complete, full-stack e-commerce website for **The Hamper Tells** — a luxury personalized gifting business selling handmade hampers, bouquets, chocolate arrangements, and celebration gifts.

---

## 🌟 Key Features

1. **Luxury Aesthetic & Design System**: Soft blush pink (`#F8E8EE`), cream, muted rose, deep rose, and Playfair Display typography designed for an elegant boutique gifting experience.
2. **Core E-Commerce Module**:
   - **Home**: Hero section, Occasions, Featured Hampers, Best Sellers, Sample Reviews & Editorial Instagram Gallery.
   - **Shop**: Real-time Search, Category Filter, Occasion Filter, Max Price Slider, and Sorting (Price, Popularity, Newest).
   - **Product Details**: Image gallery, stock indicator, included items list, and custom gift card message field.
   - **Cart & Checkout**: Persistent cart, free delivery threshold calculation (above ₹1500), address form, preferred delivery date picker, and COD / Online Payment options.
   - **Order Confirmation & Tracking**: Order ID generation, receipt details, and interactive 6-stage delivery status timeline tracker.
3. **Signature Feature — Build Your Own Hamper Studio (`custom-hamper.html`)**:
   - **Step 01 Base Box**: Small Box (₹199), Medium Box (₹299), Large Box (₹399), Gift Basket (₹349).
   - **Step 02 Gifts**: Chocolates, Teddy Bear, Flowers, Perfume, Candle, Card, Keychain, Snacks.
   - **Step 03 Packaging Theme**: Blush Pink, Lavish Purple, Passion Red, Classic Black, Pastel Delight (₹99).
   - **Step 04 Greeting Card**: Classic Card, Love Card, Birthday Card, Thank You Card (₹49).
   - **Step 05 Personal Message**: Custom message input with real-time character counter.
   - **Step 06 Summary & Dynamic Total**: Instant live total calculation on every interaction. Custom hampers add directly to the cart as real bundle items.
4. **Backend Security**: Server recalculates item prices using MongoDB product records during order creation to prevent client-side price tampering.
5. **Zero-Setup Database Execution**: Automated fallback to `mongodb-memory-server` if local MongoDB service is not running.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Bootstrap 5 (No complex frameworks like React/Angular/Vue for easy viva explanation).
- **Backend**: Node.js, Express.js (REST API architecture).
- **Database**: MongoDB & Mongoose Object Data Modeling (ODM).
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing.
- **Environment**: dotenv configuration.

---

## 🚀 Quick Start & Run Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database
Populate database with sample products, categories, workshops, and default demo customer account:
```bash
npm run seed
```

### 3. Start Application Server
```bash
npm start
```
The server will start at: **http://localhost:5000**

---

---

## 🔑 Authentication & Login Credentials

### 1. One Person Admin Login
- **Portal URL**: `http://localhost:5050/admin-login.html` (or via Login page "Go to Admin Portal" link)
- **Admin Email**: `admin@hampertells.com`
- **Admin Password**: `admin123`
- **Role**: `admin`
- **Capabilities**:
  - Full financial analytics & monthly sales vs loss statements.
  - Interactive Chart.js visual graphs (Revenue, Expenses, Wastage loss & Net profit).
  - Record new expense & loss items (Material costs, transit loss, wilted flowers, packaging).
  - Manage and update customer order fulfillment statuses in real time.
  - Directory of all registered customer logins with purchase histories.
  - Add/Delete products in store catalog.

### 2. Customer Logins ("all the login for the customers too")
- **Storefront Login**: `http://localhost:5050/login.html`
- **Pre-seeded Sample Customers**:
  - `demo@hampertells.com` (Password: `password123`)
  - `ananya@gmail.com` (Password: `password123`)
  - `rahul@gmail.com` (Password: `password123`)
  - `priya@gmail.com` (Password: `password123`)
- **Self-Registration**: Any new customer can register via `register.html` with instant customer role assignment.

---

## 📊 Monthly Sales, Revenue & Loss Tracking System

- **Gross Revenue**: Automatically computed from all confirmed/delivered customer orders.
- **Costs & Losses Recorded**:
  - Raw Materials (Dutch Roses, Sunflowers, Imported Chocolates)
  - Luxury Packaging & Ribbons
  - Courier Logistics & Dispatch
  - Damaged / Wilted Inventory Loss
  - Customer Cancellation Wastage
- **Net Profit & Margin**: `Net Profit = Gross Revenue - Total Expenses & Losses`. Computed month-by-month and visualized with interactive bar and trend line graphs!

---

## 🎓 Viva Explanation Guide for Diploma Students

1. **Frontend vs Backend**:
   - **Frontend**: HTML5, CSS3, Vanilla JS files in `frontend/` rendered in the browser for user UI.
   - **Backend**: Express.js server running in `backend/server.js` listening on port 5000 and exposing REST API routes (`/api/...`).
2. **REST API Communication**:
   - `frontend/js/api.js` uses JavaScript `fetch()` API to make GET and POST requests to the backend endpoints.
3. **Database & Fallback**:
   - Mongoose connects to MongoDB. If local Mongo is not running, `backend/config/db.js` launches an embedded `MongoMemoryServer` automatically so the project runs 100% out-of-the-box!
4. **Authentication Flow**:
   - User inputs email & password $\rightarrow$ `POST /api/auth/login` checks user in MongoDB using `bcrypt.compare()` $\rightarrow$ Backend generates signed JWT token $\rightarrow$ Frontend stores token in `localStorage` and attaches `Authorization: Bearer <token>` to protected API requests.
5. **Order Price Tampering Prevention**:
   - The frontend sends product IDs and quantities, but `backend/controllers/orderController.js` fetches product prices directly from the MongoDB database to calculate totals securely before creating the order.
