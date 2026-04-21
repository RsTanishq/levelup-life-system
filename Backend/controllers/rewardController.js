const Reward = require('../models/Reward');
const User   = require('../models/User');

// @route GET /api/rewards
exports.getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ available: true }).sort({ levelRequired: 1, coinCost: 1 });
    return res.json({ success: true, message: 'Rewards fetched', data: rewards });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route POST /api/rewards/:rewardId/unlock
exports.unlockReward = async (req, res) => {
  try {
    const { rewardId } = req.params;

    const [reward, user] = await Promise.all([
      Reward.findById(rewardId),
      User.findById(req.user.id),
    ]);

    if (!reward) return res.status(404).json({ success: false, message: 'Reward not found', data: null });
    if (!user)   return res.status(404).json({ success: false, message: 'User not found', data: null });

    // Check if already unlocked
    if (user.unlockedRewards?.includes(rewardId)) {
      return res.status(409).json({ success: false, message: 'Reward already unlocked', data: null });
    }

    // Validate requirements
    const levelCheck = validateLevelRequirement(user.level, reward.levelRequired);
    if (!levelCheck.valid) {
      return res.status(403).json({ success: false, message: levelCheck.message, data: null });
    }

    const coinCheck = validateCoinRequirement(user.coins, reward.coinCost);
    if (!coinCheck.valid) {
      return res.status(403).json({ success: false, message: coinCheck.message, data: null });
    }

    // Deduct coins and grant reward
    user.coins -= reward.coinCost;
    user.unlockedRewards = user.unlockedRewards || [];
    user.unlockedRewards.push(rewardId);
    await user.save();

    return res.json({
      success: true,
      message: `Reward "${reward.name}" unlocked!`,
      data: { reward, remainingCoins: user.coins },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// ── Validation helpers (also exported for reuse) ──────────────────────────────

exports.validateLevelRequirement = (userLevel, requiredLevel) =>
  validateLevelRequirement(userLevel, requiredLevel);

exports.validateCoinRequirement = (userCoins, coinCost) =>
  validateCoinRequirement(userCoins, coinCost);

function validateLevelRequirement(userLevel, requiredLevel) {
  if (userLevel >= requiredLevel) return { valid: true };
  return { valid: false, message: `Level ${requiredLevel} required (you are level ${userLevel})` };
}

function validateCoinRequirement(userCoins, coinCost) {
  if (userCoins >= coinCost) return { valid: true };
  return { valid: false, message: `Insufficient coins. Need ${coinCost}, have ${userCoins}` };
}
