const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin, customerEntry, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/customer-entry', customerEntry);
router.post('/admin-login', loginAdmin);
router.get('/profile', protect, getUserProfile);

module.exports = router;
