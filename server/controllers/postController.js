const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { getIO } = require('../sockets/socketManager');

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { text, images, links, tags, isAnonymous } = req.body;
    
    const post = await Post.create({
      author: req.user.id,
      content: { text, images, links },
      tags,
      isAnonymous: isAnonymous || false,
    });

    const fullPost = await Post.findById(post._id).populate('author', 'name profile.profilePic branch');
    
    // Emit for real-time feed
    getIO().emit('newPost', fullPost);
    // ... rest
    res.status(201).json({ success: true, post: fullPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const { tag, search } = req.query;
    let query = {};
    if (tag) query.tags = tag;
    if (search) query['content.text'] = { $regex: search, $options: 'i' };

    let posts = await Post.find(query)
      .populate('author', 'name profile.profilePic branch')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name profile.profilePic' }
      })
      .sort({ createdAt: -1 });

    // Anonymize authors if needed
    const processedPosts = posts.map(post => {
      const p = post.toObject();
      if (p.isAnonymous) {
        p.author = {
          name: 'Anonymous Student',
          profile: { profilePic: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
          branch: 'Confidential'
        };
      }
      return p;
    });

    res.json({ success: true, posts: processedPosts });
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

module.exports = { createPost, getPosts, likePost, addComment };
