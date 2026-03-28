const Reel = require('../models/Reel');

// @desc    Get all campus reels
// @route   GET /api/reels
// @access  Private
const getReels = async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate('author', 'name profile.profilePic')
      .sort({ createdAt: -1 });
    res.json({ success: true, reels });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Post a new reel
// @route   POST /api/reels
// @access  Private
const postReel = async (req, res) => {
  try {
    const { caption, videoUrl } = req.body;
    const reel = await Reel.create({
      caption,
      videoUrl,
      author: req.user.id,
    });
    res.status(201).json({ success: true, reel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a reel
// @route   PUT /api/reels/:id/like
// @access  Private
const likeReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    if (reel.likes.includes(req.user.id)) {
      reel.likes = reel.likes.filter(id => id.toString() !== req.user.id.toString());
    } else {
      reel.likes.push(req.user.id);
    }
    await reel.save();
    res.json({ success: true, likes: reel.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReels, postReel, likeReel };
