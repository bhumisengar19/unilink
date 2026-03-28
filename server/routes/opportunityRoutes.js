const express = require('express');
const router = express.Router();
const { getOpportunities, createOpportunity } = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getOpportunities);
router.post('/', protect, createOpportunity);

module.exports = router;
