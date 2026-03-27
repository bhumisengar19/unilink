const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');
const { getIO } = require('../sockets/socketManager');

// @desc    Send Message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  const { content, chatId, media } = req.body;

  if (!chatId) {
    return res.status(400).json({ message: 'Invalid Chat ID' });
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    media: media || [],
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate('sender', 'name profile.profilePic email');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name profile.profilePic email',
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    // Emit live message
    getIO().to(chatId).emit('messageReceived', message);

    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name profile.profilePic email')
      .populate('chat');
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { sendMessage, allMessages };
