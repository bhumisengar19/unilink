const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.json({
        success: true,
        user,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.profile.bio = req.body.bio || user.profile.bio;
      user.profile.branch = req.body.branch || user.profile.branch;
      user.profile.year = req.body.year || user.profile.year;
      user.profile.skills = req.body.skills || user.profile.skills;
      user.profile.interests = req.body.interests || user.profile.interests;
      user.profile.profilePic = req.body.profilePic || user.profile.profilePic;

      const updatedUser = await user.save();
      res.json({
        success: true,
        user: updatedUser,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Connect with user
// @route   POST /api/users/connect/:id
// @access  Private
const connectUser = async (req, res) => {
  try {
    const userToConnect = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToConnect) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.connections.includes(userToConnect._id)) {
      return res.status(400).json({ message: 'Already connected' });
    }

    if (userToConnect.pendingConnections.includes(currentUser._id)) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    userToConnect.pendingConnections.push(currentUser._id);
    await userToConnect.save();

    res.json({ success: true, message: 'Connection request sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept connection request
// @route   POST /api/users/accept/:id
// @access  Private
const acceptConnection = async (req, res) => {
  try {
    const userToAccept = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToAccept) {
       return res.status(404).json({ message: 'User not found' });
    }

    if (!currentUser.pendingConnections.includes(userToAccept._id)) {
      return res.status(400).json({ message: 'No pending request' });
    }

    // Add to each other's connections
    currentUser.connections.push(userToAccept._id);
    userToAccept.connections.push(currentUser._id);

    // Remove from pending
    currentUser.pendingConnections = currentUser.pendingConnections.filter(
      (id) => id.toString() !== userToAccept._id.toString()
    );

    await currentUser.save();
    await userToAccept.save();

    res.json({ success: true, message: 'Connection accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (with filtering)
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    const { branch, year, skills, search } = req.query;
    let query = { _id: { $ne: req.user.id } };

    if (branch) query['profile.branch'] = branch;
    if (year) query['profile.year'] = year;
    if (skills) query['profile.skills'] = { $in: skills.split(',') };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const users = await User.find(query);
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMe, updateProfile, connectUser, acceptConnection, getUsers };
