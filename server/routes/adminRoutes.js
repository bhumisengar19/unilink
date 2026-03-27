const express = require('express');
const router = express.Router();
const { getAllUsers, toggleUserStatus, getAnalytics } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id', protect, authorize('admin'), toggleUserStatus);
router.get('/analytics', protect, authorize('admin'), getAnalytics);

module.exports = router;
