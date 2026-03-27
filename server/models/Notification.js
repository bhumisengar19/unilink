const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'message', 'connection_request', 'event_reminder', 'mention'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  refId: {
    type: mongoose.Schema.Types.ObjectId,
    // ID of current object (Post, Chat, Connection, etc.)
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', NotificationSchema);
