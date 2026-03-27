const express = require('express');
const router = express.Router();
const { getOpportunities, createOpportunity, applyToOpportunity } = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getOpportunities);
router.post('/', protect, createOpportunity);
router.post('/:id/apply', protect, applyToOpportunity);

module.exports = router;
