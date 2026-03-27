const Event = require('../models/Event');
const { getIO } = require('../sockets/socketManager');

// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const { title, description, location, date, eventType, projectCollaboration } = req.body;

    const event = await Event.create({
      title,
      description,
      location,
      date,
      organizer: req.user.id,
      eventType,
      projectCollaboration,
    });

    const populatedEvent = await Event.findById(event._id).populate('organizer', 'name email profile.profilePic');

    // Notify users about new event
    getIO().emit('newEvent', populatedEvent);

    res.status(201).json({ success: true, event: populatedEvent });
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name email profile.profilePic').sort({ date: 1 });
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    RSVP for event
// @route   POST /api/events/rsvp/:id
// @access  Private
const rsvpEvent = async (req, res) => {
  try {
     const event = await Event.findById(req.params.id);
     if (!event) return res.status(404).json({ message: 'Event not found' });

     if (event.attendees.includes(req.user.id)) {
        event.attendees = event.attendees.filter(id => id.toString() !== req.user.id.toString());
     } else {
        event.attendees.push(req.user.id);
     }

     await event.save();
     res.json({ success: true, attendees: event.attendees });
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
};

module.exports = { createEvent, getEvents, rsvpEvent };
