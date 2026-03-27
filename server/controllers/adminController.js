const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user status (e.g., Ban/Unban)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = !user.isBanned; // Assuming we add this field to User model if needed
    // For now, let's just update the role or some other flag
    // Let's add isBanned to User model or role
    
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
};

// @desc    Get System Analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    
    // Engagement logic calculation
    const totalLikes = await Post.aggregate([
      { $group: { _id: null, total: { $sum: { $size: "$likes" } } } }
    ]);

    res.json({
      success: true,
      userCount,
      postCount,
      totalLikes: totalLikes[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, toggleUserStatus, getAnalytics };
