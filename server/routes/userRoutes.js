const express = require('express');
const router = express.Router();
const { getMe, updateProfile, updateProfilePic, updateEmergencyContacts, connectUser, acceptConnection, getUsers, updateLocation, getNearbyUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/profile-picture', protect, upload.single('image'), updateProfilePic);
router.put('/emergency-contacts', protect, updateEmergencyContacts);
router.post('/connect/:id', protect, connectUser);
router.post('/accept/:id', protect, acceptConnection);
router.get('/', protect, getUsers);
router.put('/location', protect, updateLocation);
router.get('/nearby', protect, getNearbyUsers);
router.get('/leaderboard', protect, async (req, res) => {
  try {
     const User = require('../models/User');
     const users = await User.find({})
       .select('name profile.profilePic gamification.points')
       .sort({ 'gamification.points': -1 })
       .limit(10);
     res.json({ success: true, users });
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
});

module.exports = router;
