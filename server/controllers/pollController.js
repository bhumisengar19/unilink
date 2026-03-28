const Poll = require('../models/Poll');
const { getIO } = require('../sockets/socketManager');

// @desc    Create a new poll
// @route   POST /api/polls
// @access  Private
const createPoll = async (req, res) => {
  try {
    const { question, options, expiresHours = 24 } = req.body;
    
    if (!options || options.length < 2) {
      return res.status(400).json({ message: 'Poll must have at least 2 options' });
    }

    const poll = await Poll.create({
      question,
      options: options.map(opt => ({ text: opt, votes: [] })),
      author: req.user.id,
      expiresAt: new Date(Date.now() + expiresHours * 60 * 60 * 1000),
    });

    const populatedPoll = await Poll.findById(poll._id).populate('author', 'name profile.profilePic');
    getIO().emit('newPoll', populatedPoll);

    res.status(201).json({ success: true, poll: populatedPoll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active polls
// @route   GET /api/polls
// @access  Private
const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ expiresAt: { $gt: new Date() } })
      .populate('author', 'name profile.profilePic')
      .sort({ createdAt: -1 });
    res.json({ success: true, polls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vote in a poll
// @route   PUT /api/polls/:id/vote
// @access  Private
const votePoll = async (req, res) => {
  try {
    const { optionId } = req.body;
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    if (poll.expiresAt < new Date()) return res.status(400).json({ message: 'Poll closed' });

    // Remove user's previous votes if any
    poll.options.forEach(opt => {
      opt.votes = opt.votes.filter(v => v.toString() !== req.user.id.toString());
    });

    // Add new vote
    const option = poll.options.id(optionId);
    if (!option) return res.status(400).json({ message: 'Invalid option' });
    
    option.votes.push(req.user.id);
    await poll.save();

    getIO().emit('updatePoll', poll);
    res.json({ success: true, poll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPoll, getPolls, votePoll };
