const express = require('express');
const router = express.Router();
const { getRooms, createRoom, joinRoom } = require('../controllers/studyRoomController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getRooms);
router.post('/', protect, createRoom);
router.put('/join/:id', protect, joinRoom);

module.exports = router;
