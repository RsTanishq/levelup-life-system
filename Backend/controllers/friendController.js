const User = require('../models/User');

// @route POST /api/friends/request/:userId
exports.sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot add yourself', data: null });
    }

    const [sender, recipient] = await Promise.all([
      User.findById(req.user.id),
      User.findById(userId),
    ]);

    if (!recipient) return res.status(404).json({ success: false, message: 'User not found', data: null });

    const alreadyFriends = sender.friends?.includes(userId);
    const alreadySent    = recipient.friendRequests?.includes(req.user.id);

    if (alreadyFriends) return res.status(409).json({ success: false, message: 'Already friends', data: null });
    if (alreadySent)    return res.status(409).json({ success: false, message: 'Request already sent', data: null });

    recipient.friendRequests = recipient.friendRequests || [];
    recipient.friendRequests.push(req.user.id);
    await recipient.save();

    // TODO: socket notification
    // io.to(userId).emit('friendRequest', { from: sender.username });

    return res.json({ success: true, message: 'Friend request sent', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route PATCH /api/friends/accept/:userId
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    const [me, requester] = await Promise.all([
      User.findById(req.user.id),
      User.findById(userId),
    ]);

    if (!requester) return res.status(404).json({ success: false, message: 'User not found', data: null });

    const hasRequest = me.friendRequests?.some((id) => id.toString() === userId);
    if (!hasRequest) {
      return res.status(400).json({ success: false, message: 'No friend request from this user', data: null });
    }

    // Remove request and add to both friend lists
    me.friendRequests = me.friendRequests.filter((id) => id.toString() !== userId);
    me.friends = [...(me.friends || []), userId];
    requester.friends = [...(requester.friends || []), req.user.id];

    await Promise.all([me.save(), requester.save()]);

    return res.json({
      success: true,
      message: `You and ${requester.username} are now friends`,
      data: { friendId: userId, username: requester.username },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route DELETE /api/friends/:userId
exports.removeFriend = async (req, res) => {
  try {
    const { userId } = req.params;

    await Promise.all([
      User.findByIdAndUpdate(req.user.id, { $pull: { friends: userId } }),
      User.findByIdAndUpdate(userId,       { $pull: { friends: req.user.id } }),
    ]);

    return res.json({ success: true, message: 'Friend removed', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route GET /api/friends
exports.getFriendsList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friends', 'username level rank xp lastLogin')
      .populate('friendRequests', 'username level rank');

    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null });

    return res.json({
      success: true,
      message: 'Friends list fetched',
      data: {
        friends:        user.friends        || [],
        friendRequests: user.friendRequests || [],
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};
