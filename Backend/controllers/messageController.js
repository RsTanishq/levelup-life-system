const Message = require('../models/Message');
const User    = require('../models/User');

// @route POST /api/messages
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;

    if (recipientId === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot message yourself', data: null });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ success: false, message: 'Recipient not found', data: null });

    const message = await Message.create({
      sender:    req.user.id,
      recipient: recipientId,
      content,
      readAt:    null,
    });

    await message.populate([
      { path: 'sender',    select: 'username rank' },
      { path: 'recipient', select: 'username rank' },
    ]);

    // TODO: emit via Socket.io when enabled
    // io.to(recipientId).emit('newMessage', message);

    return res.status(201).json({ success: true, message: 'Message sent', data: message });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route GET /api/messages/conversation/:userId
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 30 } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: userId },
        { sender: userId, recipient: req.user.id },
      ],
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('sender recipient', 'username rank');

    return res.json({ success: true, message: 'Conversation fetched', data: messages.reverse() });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route PATCH /api/messages/:messageId/read
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found', data: null });

    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized', data: null });
    }

    message.readAt = new Date();
    await message.save();

    return res.json({ success: true, message: 'Message marked as read', data: { readAt: message.readAt } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};
