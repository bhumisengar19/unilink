const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, addComment } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPost);
router.get('/', getPosts);
router.put('/like/:id', protect, likePost);
router.post('/comment/:id', protect, addComment);

module.exports = router;
