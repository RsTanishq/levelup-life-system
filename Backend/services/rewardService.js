// services/rewardService.js
// Manages digital and physical reward unlocking, validation, and auto-unlock logic.

const Reward = require('../models/Reward');
const User   = require('../models/User');

// ── Constants ─────────────────────────────────────────────────────────────────

/** Supported reward type identifiers. */
const REWARD_TYPES = ['badge', 'theme', 'title', 'sticker', 'tshirt', 'hoodie'];

/**
 * Auto-unlock milestone rules.
 * Each entry maps a condition function to a set of reward tags to unlock automatically.
 * Extend this array to add new milestone triggers without touching service logic.
 */
const AUTO_UNLOCK_MILESTONES = [
  {
    id:        'level_10',
    label:     'Reached Level 10',
    matches:   (user) => user.level >= 10,
    rewardTag: 'level_milestone_10',
  },
  {
    id:        'level_25',
    label:     'Reached Level 25',
    matches:   (user) => user.level >= 25,
    rewardTag: 'level_milestone_25',
  },
  {
    id:        'level_50',
    label:     'Reached Level 50',
    matches:   (user) => user.level >= 50,
    rewardTag: 'level_milestone_50',
  },
  {
    id:        'streak_7',
    label:     '7-Day Streak',
    matches:   (user) => (user.streak?.current ?? 0) >= 7,
    rewardTag: 'streak_milestone_7',
  },
  {
    id:        'streak_30',
    label:     '30-Day Streak',
    matches:   (user) => (user.streak?.current ?? 0) >= 30,
    rewardTag: 'streak_milestone_30',
  },
  {
    id:        'achievement_10',
    label:     '10 Achievements Earned',
    matches:   (user) => (user.unlockedAchievements?.length ?? 0) >= 10,
    rewardTag: 'achievement_milestone_10',
  },
];

// ── Validation helpers (pure, no DB) ─────────────────────────────────────────

/**
 * Returns true if the user meets the reward's level requirement.
 * @param {object} user
 * @param {object} reward
 * @returns {boolean}
 */
const validateLevelRequirement = (user, reward) =>
  (user.level ?? 0) >= (reward.requiredLevel ?? 0);

/**
 * Returns true if the user has enough coins to purchase the reward.
 * @param {object} user
 * @param {object} reward
 * @returns {boolean}
 */
const validateCoinRequirement = (user, reward) =>
  (user.coins ?? 0) >= (reward.requiredCoins ?? 0);

/**
 * Safely subtracts coins from a user, preventing a negative balance.
 * Mutates the user document in-place; caller must save.
 *
 * @param {import('mongoose').Document} user
 * @param {number} amount
 * @throws {Error} if the user has insufficient coins
 */
const deductCoins = (user, amount) => {
  if ((user.coins ?? 0) < amount) {
    throw new Error(`Insufficient coins. Required: ${amount}, Available: ${user.coins ?? 0}`);
  }
  user.coins = (user.coins ?? 0) - amount;
};

// ── Core service functions ────────────────────────────────────────────────────

/**
 * Returns all rewards the user is eligible to unlock but hasn't yet.
 * Filters by level requirement, coin requirement, and unlocked status.
 *
 * @param {import('mongoose').Document} user
 * @returns {Promise<Array<object>>} eligible reward documents
 */
const getAvailableRewards = async (user) => {
  if (!user) throw new Error('User document is required');

  const unlockedIds = new Set(
    (user.unlockedRewards ?? []).map((id) => id.toString())
  );

  const rewards = await Reward.find({ available: true });

  return rewards.filter((reward) => {
    const alreadyOwned  = unlockedIds.has(reward._id.toString());
    const levelOk       = validateLevelRequirement(user, reward);
    const coinsOk       = validateCoinRequirement(user, reward);
    return !alreadyOwned && levelOk && coinsOk;
  });
};

/**
 * Unlocks a reward for a user after validating all requirements.
 * Handles both digital and physical rewards.
 *
 * @param {string} userId
 * @param {string} rewardId
 * @returns {Promise<{
 *   success: boolean,
 *   message: string,
 *   reward: object,
 *   remainingCoins: number,
 *   requiresShippingDetails?: boolean,
 * }>}
 */
const unlockReward = async (userId, rewardId) => {
  const [user, reward] = await Promise.all([
    User.findById(userId),
    Reward.findById(rewardId),
  ]);

  if (!user)   throw new Error('User not found');
  if (!reward) throw new Error('Reward not found');

  // Already unlocked?
  const alreadyUnlocked = (user.unlockedRewards ?? [])
    .some((id) => id.toString() === rewardId);
  if (alreadyUnlocked) {
    throw new Error(`Reward "${reward.title}" is already unlocked`);
  }

  // Validate level
  if (!validateLevelRequirement(user, reward)) {
    throw new Error(
      `Level ${reward.requiredLevel} required to unlock "${reward.title}" (you are level ${user.level})`
    );
  }

  // Validate coins
  if (!validateCoinRequirement(user, reward)) {
    throw new Error(
      `Insufficient coins. Need ${reward.requiredCoins}, have ${user.coins ?? 0}`
    );
  }

  // Deduct coins and grant reward
  deductCoins(user, reward.requiredCoins ?? 0);
  user.unlockedRewards = [...(user.unlockedRewards ?? []), reward._id];
  await user.save();

  const response = {
    success:        true,
    message:        `Reward "${reward.title}" unlocked successfully`,
    reward:         reward.toObject(),
    remainingCoins: user.coins,
  };

  // Physical reward — flag for shipping confirmation flow
  if (reward.isPhysical) {
    response.requiresShippingDetails = true;
    response.message = `"${reward.title}" unlocked! Please confirm your shipping address to complete the order.`;
  }

  return response;
};

/**
 * Returns all rewards the user has already unlocked, populated with reward details.
 *
 * @param {import('mongoose').Document} user - must have unlockedRewards populated, or pass a raw ID
 * @returns {Promise<Array<object>>}
 */
const getUnlockedRewards = async (user) => {
  if (!user) throw new Error('User document is required');

  if (!user.unlockedRewards?.length) return [];

  const rewards = await Reward.find({ _id: { $in: user.unlockedRewards } });
  return rewards;
};

/**
 * Scans all auto-unlock milestone rules and unlocks any newly eligible rewards.
 * Idempotent — will not re-unlock already owned rewards.
 *
 * @param {import('mongoose').Document} user
 * @returns {Promise<{
 *   autoUnlocked: Array<{ milestone: string, reward: object }>,
 *   coinsDeducted: number,
 * }>}
 */
const checkAutoUnlockRewards = async (user) => {
  if (!user) throw new Error('User document is required');

  const unlockedIds = new Set(
    (user.unlockedRewards ?? []).map((id) => id.toString())
  );

  const autoUnlocked  = [];
  let   coinsDeducted = 0;

  for (const milestone of AUTO_UNLOCK_MILESTONES) {
    if (!milestone.matches(user)) continue;

    // Find the reward associated with this milestone tag
    const reward = await Reward.findOne({ tag: milestone.rewardTag, available: true });
    if (!reward) continue;

    // Skip if already unlocked
    if (unlockedIds.has(reward._id.toString())) continue;

    // Auto-unlock: coin cost waived for milestone rewards (by design)
    user.unlockedRewards = [...(user.unlockedRewards ?? []), reward._id];
    unlockedIds.add(reward._id.toString());

    autoUnlocked.push({ milestone: milestone.label, reward: reward.toObject() });
  }

  if (autoUnlocked.length) await user.save();

  return { autoUnlocked, coinsDeducted };
};

// ── Exports ───────────────────────────────────────────────────────────────────

module.exports = {
  getAvailableRewards,
  unlockReward,
  validateLevelRequirement,
  validateCoinRequirement,
  deductCoins,
  getUnlockedRewards,
  checkAutoUnlockRewards,
  REWARD_TYPES,
  AUTO_UNLOCK_MILESTONES,
};
