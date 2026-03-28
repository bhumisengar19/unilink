const express = require('express');
const router = express.Router();
const { getStudyRooms, createStudyRoom, joinStudyRoom } = require('../controllers/studyRoomController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getStudyRooms);
router.post('/', protect, createStudyRoom);
router.post('/:id/join', protect, joinStudyRoom);

module.exports = router;
