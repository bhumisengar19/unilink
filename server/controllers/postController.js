const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { getIO } = require('../sockets/socketManager');

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { text, images, links, tags, isAnonymous, isPoll, pollOptions } = req.body;
    
    const post = await Post.create({
      author: req.user.id,
      content: { text, images, links },
      tags,
      isAnonymous: isAnonymous || false,
      isPoll: isPoll || false,
      pollOptions: isPoll ? pollOptions.map(opt => ({ text: opt, votes: [] })) : [],
    });

    const fullPost = await Post.findById(post._id).populate('author', 'name profile.profilePic branch');
    
    // Emit for real-time feed
    getIO().emit('newPost', fullPost);

    // Update Points
    const user = await User.findById(req.user.id);
    user.gamification.points += 10;
    await user.save();

    res.status(201).json({ success: true, post: fullPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts (Feed)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const { tag, search } = req.query;
    let query = {};
    if (tag) query.tags = tag;
    if (search) query['content.text'] = { $regex: search, $options: 'i' };

    const posts = await Post.find(query)
      .populate('author', 'name profile.profilePic branch')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name profile.profilePic' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a post
// @route   PUT /api/posts/like/:id
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id.toString());
    } else {
      post.likes.push(req.user.id);
      
      // Update Trending Score
      post.trendingScore += 1;
    }

    await post.save();
    res.json({ success: true, likes: post.likes });
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/comment/:id
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({
      author: req.user.id,
      post: post._id,
      text,
    });

    post.comments.push(comment._id);
    post.trendingScore += 2;
    await post.save();

    const populatedComment = await Comment.findById(comment._id).populate('author', 'name profile.profilePic');

    res.status(201).json({ success: true, comment: populatedComment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vote in a poll
// @route   PUT /api/posts/vote/:id
// @access  Private
const votePost = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post || !post.isPoll) return res.status(404).json({ message: 'Poll not found' });

    // Remove user's previous vote if any
    post.pollOptions.forEach(opt => {
      opt.votes = opt.votes.filter(v => v.toString() !== req.user.id.toString());
    });

    // Add new vote
    post.pollOptions[optionIndex].votes.push(req.user.id);
    
    await post.save();
    
    getIO().emit('pollUpdate', { postId: post._id, pollOptions: post.pollOptions });

    res.json({ success: true, pollOptions: post.pollOptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPost, getPosts, likePost, addComment, votePost };
