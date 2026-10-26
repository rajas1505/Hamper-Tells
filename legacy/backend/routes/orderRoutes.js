const express = require('express');
const router = express.Router();
const { createOrder, verifyUpiPayment, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.post('/', optionalAuth, createOrder);
router.post('/:id/pay', verifyUpiPayment);
router.get('/myorders', protect, getMyOrders);
router.get('/track/:id', getOrderById);
router.get('/:id', getOrderById);

module.exports = router;
