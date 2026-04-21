const User = require('../models/User');

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth()    === b.getMonth()    &&
  a.getDate()     === b.getDate();

const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

// @route PATCH /api/streak/update
exports.updateDailyStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null });

    const today        = new Date();
    const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate) : null;

    // Already updated today → idempotent
    if (lastActivity && isSameDay(lastActivity, today)) {
      return res.json({
        success: true,
        message: 'Streak already updated today',
        data:    { streak: user.streak, lastActivityDate: user.lastActivityDate },
      });
    }

    if (lastActivity && isYesterday(lastActivity)) {
      user.streak += 1;  // extend streak
    } else {
      user.streak = 1;   // reset
    }

    user.bestStreak        = Math.max(user.bestStreak || 0, user.streak);
    user.lastActivityDate  = today;

    await user.save();

    return res.json({
      success: true,
      message: `Streak updated to ${user.streak} day(s)`,
      data:    { streak: user.streak, bestStreak: user.bestStreak, lastActivityDate: user.lastActivityDate },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route GET /api/streak
exports.getStreakStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('streak bestStreak lastActivityDate username');
    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null });

    const today        = new Date();
    const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
    const activeToday  = lastActivity && isSameDay(lastActivity, today);
    const atRisk       = lastActivity && isYesterday(lastActivity) && !activeToday;

    return res.json({
      success: true,
      message: 'Streak stats fetched',
      data: {
        username:         user.username,
        currentStreak:    user.streak,
        bestStreak:       user.bestStreak || 0,
        lastActivityDate: user.lastActivityDate,
        activeToday,
        streakAtRisk:     atRisk,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route PATCH /api/streak/reset-check  (cron-safe, call nightly)
exports.resetStreakIfMissedDay = async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // Users whose last activity was BEFORE yesterday → missed a day
    const result = await User.updateMany(
      { lastActivityDate: { $lt: yesterday }, streak: { $gt: 0 } },
      { $set: { streak: 0 } }
    );

    return res.json({
      success: true,
      message: 'Streak reset check complete',
      data:    { resetCount: result.modifiedCount },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};
