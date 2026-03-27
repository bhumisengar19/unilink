const express = require('express');
const router = express.Router();
const { createEvent, getEvents, rsvpEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createEvent);
router.get('/', getEvents);
router.post('/rsvp/:id', protect, rsvpEvent);

module.exports = router;
