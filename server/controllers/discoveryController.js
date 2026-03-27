const User = require('../models/User');

// @desc    Get matching users based on skills
// @route   GET /api/users/matches
// @access  Private
const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find users who have the skills this user is looking for
    const matches = await User.find({
      _id: { $ne: user._id },
      'profile.skills': { $in: user.profile.lookingFor || [] }
    }).limit(20);

    res.json({
      success: true,
      matches
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get nearby users
// @route   GET /api/users/nearby
// @access  Private
const getNearbyUsers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.profile.location) {
            return res.status(400).json({ message: 'Location data not available for user' });
        }

        const maxDistance = req.query.distance || 1000; // default 1km

        const nearby = await User.find({
            _id: { $ne: user._id },
            'profile.location': {
                $near: {
                    $geometry: user.profile.location,
                    $maxDistance: maxDistance
                }
            }
        }).limit(20);

        res.json({
            success: true,
            nearby
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({})
      .sort({ 'gamification.points': -1 })
      .limit(10)
      .select('name profile.profilePic gamification.points gamification.badges gamification.level');

    res.json({
      success: true,
      leaderboard: topUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMatches, getNearbyUsers, getLeaderboard };
