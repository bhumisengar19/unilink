const mongoose = require('mongoose');

const ReelSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Reel', ReelSchema);
