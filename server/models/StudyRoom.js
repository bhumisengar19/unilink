const mongoose = require('mongoose');

const StudyRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a room name'],
    trim: true,
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  timer: {
    duration: { type: Number, default: 1500 }, // 25 mins in seconds
    isRunning: { type: Boolean, default: false },
    startTime: Date,
  },
  type: {
    type: String,
    enum: ['focus', 'collaborative', 'presentation'],
    default: 'collaborative',
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('StudyRoom', StudyRoomSchema);
