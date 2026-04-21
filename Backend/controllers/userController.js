const User = require('../models/User');

// @route GET /api/users/stats
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('stats xp level rank coins streak username');
    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null });

    return res.json({ success: true, message: 'Stats fetched', data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route PATCH /api/users/stats
exports.updateStats = async (req, res) => {
  try {
    const { strength = 0, intelligence = 0, endurance = 0, charisma = 0, focus = 0 } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null });

    user.stats.strength    += strength;
    user.stats.intelligence += intelligence;
    user.stats.endurance   += endurance;
    user.stats.charisma    += charisma;
    user.stats.focus       += focus;

    await user.save();

    return res.json({ success: true, message: 'Stats updated', data: user.stats });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route PATCH /api/users/coins
exports.addCoins = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid coin amount', data: null });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { coins: amount } },
      { new: true, select: 'coins username' }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null });

    return res.json({ success: true, message: `${amount} coins added`, data: { coins: user.coins } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};
