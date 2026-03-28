const StudyRoom = require('../models/StudyRoom');

// @desc    Get all study rooms
// @route   GET /api/study-rooms
// @access  Private
const getStudyRooms = async (req, res) => {
  try {
    const rooms = await StudyRoom.find({ isPrivate: false })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a study room
// @route   POST /api/study-rooms
// @access  Private
const createStudyRoom = async (req, res) => {
  try {
    const { name, description, topic, isPrivate } = req.body;
    const room = await StudyRoom.create({
      name,
      description,
      topic,
      isPrivate,
      createdBy: req.user.id,
      members: [req.user.id],
    });
    res.status(201).json({ success: true, room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Join a study room
// @route   POST /api/study-rooms/:id/join
// @access  Private
const joinStudyRoom = async (req, res) => {
  try {
    const room = await StudyRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (!room.members.includes(req.user.id)) {
      room.members.push(req.user.id);
      await room.save();
    }
    res.json({ success: true, room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getStudyRooms, createStudyRoom, joinStudyRoom };
