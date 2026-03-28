const express = require('express');
const router = express.Router();
const { getReels, postReel, likeReel } = require('../controllers/reelController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getReels);
router.post('/', protect, postReel);
router.put('/:id/like', protect, likeReel);

module.exports = router;
