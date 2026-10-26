const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  getExpenses,
  createExpense,
  deleteExpense,
  createProduct,
  deleteProduct
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes are protected and restricted to Admin
router.use(protect, adminOnly);

// Analytics & Financial Records
router.get('/analytics', getDashboardAnalytics);

// Orders Management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Customers Management
router.get('/customers', getAllCustomers);

// Expenses & Losses Recording
router.get('/expenses', getExpenses);
router.post('/expenses', createExpense);
router.delete('/expenses/:id', deleteExpense);

// Product Catalog
router.post('/products', createProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
