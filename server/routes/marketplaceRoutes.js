const express = require('express');
const router = express.Router();
const { getProducts, postProduct } = require('../controllers/marketplaceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProducts);
router.post('/', protect, postProduct);

module.exports = router;
