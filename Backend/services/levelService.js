// services/levelService.js
// Handles XP progression, level calculation, and rank management.

const User = require('../models/User');

// ── Constants ─────────────────────────────────────────────────────────────────

const RANK_TIERS = [
  { minLevel: 100, rank: 'Monarch' },
  { minLevel: 50,  rank: 'Shadow Hunter' },
  { minLevel: 25,  rank: 'Gold Hunter' },
  { minLevel: 10,  rank: 'Silver Hunter' },
  { minLevel: 1,   rank: 'Bronze Hunter' },
];

// ── Pure calculation helpers ──────────────────────────────────────────────────

/**
 * Derives level from total XP.
 * Formula: level = floor(sqrt(totalXP / 50))
 * @param {number} totalXP
 * @returns {number} level (minimum 1)
 */
const calculateLevel = (totalXP) => Math.max(1, Math.floor(Math.sqrt(totalXP / 50)));

/**
 * Returns the minimum XP required to reach a given level.
 * Inverse of calculateLevel: level² × 50
 * @param {number} level
 * @returns {number} xp threshold
 */
const xpForLevel = (level) => level * level * 50;

/**
 * Maps a numeric level to its rank tier label.
 * @param {number} level
 * @returns {string} rank name
 */
const calculateRank = (level) => {
  const tier = RANK_TIERS.find((t) => level >= t.minLevel);
  return tier ? tier.rank : 'Bronze Hunter';
};

// ── Core service functions ────────────────────────────────────────────────────

/**
 * Adds XP to a user, recalculates level and rank, persists to DB.
 *
 * @param {import('mongoose').Document} user  - Mongoose User document
 * @param {number}                      xpAmount
 * @returns {Promise<{
 *   user: Document,
 *   previousLevel: number,
 *   leveledUp: boolean,
 *   level: number,
 *   rank: string,
 *   xp: number,
 *   xpGained: number,
 *   xpToNextLevel: number,
 * }>}
 */
const addXP = async (user, xpAmount) => {
  if (!user)           throw new Error('User document is required');
  if (xpAmount <= 0)   throw new Error('XP amount must be a positive number');

  const previousLevel = user.level ?? 1;

  user.xp    = (user.xp || 0) + xpAmount;
  user.level  = calculateLevel(user.xp);
  user.rank   = calculateRank(user.level);

  await user.save();

  const leveledUp      = user.level > previousLevel;
  const xpToNextLevel  = xpForLevel(user.level + 1) - user.xp;

  return {
    user,
    previousLevel,
    leveledUp,
    level:        user.level,
    rank:         user.rank,
    xp:           user.xp,
    xpGained:     xpAmount,
    xpToNextLevel: Math.max(0, xpToNextLevel),
  };
};

/**
 * Returns a structured XP progress snapshot for a user.
 *
 * @param {import('mongoose').Document} user
 * @returns {{
 *   level: number,
 *   rank: string,
 *   currentXP: number,
 *   currentLevelXP: number,
 *   nextLevelXP: number,
 *   xpProgress: number,
 *   xpToNextLevel: number,
 *   progressPercent: number,
 * }}
 */
const getXPProgress = (user) => {
  if (!user) throw new Error('User document is required');

  const level         = user.level ?? calculateLevel(user.xp ?? 0);
  const rank          = user.rank  ?? calculateRank(level);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP    = xpForLevel(level + 1);
  const xpProgress     = (user.xp || 0) - currentLevelXP;
  const xpRequired     = nextLevelXP - currentLevelXP;
  const xpToNextLevel  = Math.max(0, nextLevelXP - (user.xp || 0));
  const progressPercent = Math.min(100, Math.floor((xpProgress / xpRequired) * 100));

  return {
    level,
    rank,
    currentXP:      user.xp || 0,
    currentLevelXP,
    nextLevelXP,
    xpProgress:     Math.max(0, xpProgress),
    xpToNextLevel,
    progressPercent,
  };
};

// ── Exports ───────────────────────────────────────────────────────────────────

module.exports = {
  addXP,
  calculateLevel,
  calculateRank,
  getXPProgress,
  xpForLevel, // exported for use in controllers / tests
};
