const express = require('express');
const router = express.Router();
const { getWorkshops, bookWorkshop } = require('../controllers/workshopController');

router.get('/', getWorkshops);
router.post('/book', bookWorkshop);

module.exports = router;
