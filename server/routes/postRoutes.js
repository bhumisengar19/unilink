const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, addComment, votePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPost);
router.get('/', getPosts);
router.put('/like/:id', protect, likePost);
router.put('/vote/:id', protect, votePost);
router.post('/comment/:id', protect, addComment);

module.exports = router;
