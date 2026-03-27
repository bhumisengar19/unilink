const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    text: {
      type: String,
      required: true,
    },
    images: [String],
    links: [String],
  },
  tags: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  shares: {
    type: Number,
    default: 0,
  },
  trendingScore: {
    type: Number,
    default: 0,
  },
  isSavedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  isPoll: {
    type: Boolean,
    default: false,
  },
  pollOptions: [{
    text: String,
    votes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  }],
  type: {
    type: String,
    enum: ['post', 'opportunity', 'market'],
    default: 'post',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Post', PostSchema);
