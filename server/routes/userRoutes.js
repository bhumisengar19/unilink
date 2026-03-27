const express = require('express');
const router = express.Router();
const { getMe, updateProfile, connectUser, acceptConnection, getUsers } = require('../controllers/userController');
const { getMatches, getNearbyUsers, getLeaderboard } = require('../controllers/discoveryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/connect/:id', protect, connectUser);
router.post('/accept/:id', protect, acceptConnection);
router.get('/matches', protect, getMatches);
router.get('/nearby', protect, getNearbyUsers);
router.get('/leaderboard', getLeaderboard);
router.get('/', protect, getUsers);

module.exports = router;
