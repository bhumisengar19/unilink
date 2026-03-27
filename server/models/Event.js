const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: String,
  date: {
    type: Date,
    required: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventType: {
    type: String,
    enum: ['hackathon', 'workshop', 'club_meeting', 'other'],
    default: 'other',
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  projectCollaboration: {
    lookingForTeam: {
      type: Boolean,
      default: false,
    },
    rolesNeeded: [String],
  },
  bannerImg: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Event', EventSchema);
