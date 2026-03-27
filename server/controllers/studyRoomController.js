const StudyRoom = require('../models/StudyRoom');

// @desc    Get all active study rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
  try {
    const rooms = await StudyRoom.find({ isActive: true })
      .populate('createdBy', 'name profile.profilePic')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a study room
// @route   POST /api/rooms
// @access  Private
const createRoom = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    
    const room = await StudyRoom.create({
      name,
      description,
      type,
      createdBy: req.user.id,
      members: [req.user.id]
    });

    res.status(201).json({
      success: true,
      room
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a study room
// @route   PUT /api/rooms/join/:id
// @access  Private
const joinRoom = async (req, res) => {
  try {
    const room = await StudyRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (!room.members.includes(req.user.id)) {
      room.members.push(req.user.id);
      await room.save();
    }

    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRooms, createRoom, joinRoom };
