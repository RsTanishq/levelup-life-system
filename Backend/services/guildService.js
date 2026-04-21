// services/guildService.js
// Handles guild creation, membership, XP progression, leveling, and contribution tracking.

const Guild = require('../models/Guild');
const User  = require('../models/User');

// ── Constants ─────────────────────────────────────────────────────────────────

const GUILD_ROLES = {
  LEADER:      'Leader',
  OFFICER:     'Officer',
  MEMBER:      'Member',
  NEW_RECRUIT: 'New Recruit',
};

/** Rewards unlocked when the guild reaches a milestone level. */
const GUILD_LEVEL_REWARDS = [
  { level: 20, reward: 'Merch Unlock Access' },
  { level: 10, reward: 'Guild Badge Unlock' },
  { level: 5,  reward: 'XP Boost +5%' },
];

// ── Pure calculation helpers ──────────────────────────────────────────────────

/**
 * Derives guild level from total XP.
 * Formula: guildLevel = floor(sqrt(totalXP / 100))
 * @param {number} totalXP
 * @returns {number} guild level (minimum 0)
 */
const getGuildLevel = (totalXP) => Math.floor(Math.sqrt((totalXP || 0) / 100));

/**
 * Returns the reward unlocked at a given guild level, or null if none.
 * @param {number} level
 * @returns {string|null}
 */
const rewardForLevel = (level) => {
  const match = GUILD_LEVEL_REWARDS.find((r) => r.level === level);
  return match ? match.reward : null;
};

// ── Core service functions ────────────────────────────────────────────────────

/**
 * Creates a new guild and assigns the creator as Leader.
 *
 * @param {string} userId
 * @param {string} guildName
 * @param {{ tag?: string, description?: string }} [options]
 * @returns {Promise<{ guild: Document, message: string }>}
 */
const createGuild = async (userId, guildName, options = {}) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  if (user.guild) throw new Error('You must leave your current guild before creating one');

  const exists = await Guild.findOne({ name: guildName });
  if (exists) throw new Error(`Guild name "${guildName}" is already taken`);

  const guild = await Guild.create({
    name:        guildName,
    tag:         options.tag         || null,
    description: options.description || null,
    leader:      userId,
    members: [{
      userId,
      role:           GUILD_ROLES.LEADER,
      contributionXP: 0,
      joinedAt:       new Date(),
    }],
    totalXP:   0,
    guildLevel: 0,
  });

  user.guild = guild._id;
  await user.save();

  return { guild, message: `Guild "${guildName}" created successfully` };
};

/**
 * Adds a user to a guild as a New Recruit.
 *
 * @param {string} userId
 * @param {string} guildId
 * @returns {Promise<{ guild: Document, message: string }>}
 */
const joinGuild = async (userId, guildId) => {
  const [user, guild] = await Promise.all([
    User.findById(userId),
    Guild.findById(guildId),
  ]);

  if (!user)  throw new Error('User not found');
  if (!guild) throw new Error('Guild not found');
  if (user.guild) throw new Error('Leave your current guild before joining another');

  const alreadyMember = guild.members.some((m) => m.userId.toString() === userId);
  if (alreadyMember) throw new Error('User is already a member of this guild');

  guild.members.push({
    userId,
    role:           GUILD_ROLES.NEW_RECRUIT,
    contributionXP: 0,
    joinedAt:       new Date(),
  });

  user.guild = guild._id;

  await Promise.all([guild.save(), user.save()]);

  return { guild, message: `Joined guild "${guild.name}" as ${GUILD_ROLES.NEW_RECRUIT}` };
};

/**
 * Removes a user from a guild. Leaders must transfer leadership first.
 *
 * @param {string} userId
 * @param {string} guildId
 * @returns {Promise<{ message: string }>}
 */
const leaveGuild = async (userId, guildId) => {
  const [user, guild] = await Promise.all([
    User.findById(userId),
    Guild.findById(guildId),
  ]);

  if (!user)  throw new Error('User not found');
  if (!guild) throw new Error('Guild not found');

  if (guild.leader.toString() === userId) {
    throw new Error('Transfer guild leadership before leaving');
  }

  const isMember = guild.members.some((m) => m.userId.toString() === userId);
  if (!isMember) throw new Error('User is not a member of this guild');

  guild.members = guild.members.filter((m) => m.userId.toString() !== userId);
  user.guild = null;

  await Promise.all([guild.save(), user.save()]);

  return { message: `Left guild "${guild.name}" successfully` };
};

/**
 * Adds XP to a guild, recalculates guild level, and returns any newly unlocked reward.
 *
 * @param {string} guildId
 * @param {number} xpAmount
 * @returns {Promise<{
 *   guildLevel: number,
 *   totalXP: number,
 *   previousLevel: number,
 *   leveledUp: boolean,
 *   unlockedReward: string|null,
 * }>}
 */
const addGuildXP = async (guildId, xpAmount) => {
  if (xpAmount <= 0) throw new Error('XP amount must be a positive number');

  const guild = await Guild.findById(guildId);
  if (!guild) throw new Error('Guild not found');

  const previousLevel = guild.guildLevel ?? getGuildLevel(guild.totalXP);

  guild.totalXP   = (guild.totalXP || 0) + xpAmount;
  guild.guildLevel = getGuildLevel(guild.totalXP);

  const leveledUp      = guild.guildLevel > previousLevel;
  const unlockedReward = leveledUp ? rewardForLevel(guild.guildLevel) : null;

  await guild.save();

  return {
    guildLevel:     guild.guildLevel,
    totalXP:        guild.totalXP,
    previousLevel,
    leveledUp,
    unlockedReward,
  };
};

/**
 * Increments a member's personal contribution XP within a guild.
 *
 * @param {string} userId
 * @param {string} guildId
 * @param {number} xpAmount
 * @returns {Promise<{ userId: string, contributionXP: number, guildId: string }>}
 */
const trackContribution = async (userId, guildId, xpAmount) => {
  if (xpAmount <= 0) throw new Error('XP amount must be a positive number');

  const guild = await Guild.findById(guildId);
  if (!guild) throw new Error('Guild not found');

  const member = guild.members.find((m) => m.userId.toString() === userId);
  if (!member) throw new Error('User is not a member of this guild');

  member.contributionXP = (member.contributionXP || 0) + xpAmount;
  await guild.save();

  return { userId, contributionXP: member.contributionXP, guildId };
};

/**
 * Returns guild members sorted by contributionXP descending.
 *
 * @param {string} guildId
 * @returns {Promise<Array<{ rank: number, userId: string, username: string, contributionXP: number, role: string }>>}
 */
const getGuildLeaderboard = async (guildId) => {
  const guild = await Guild.findById(guildId).populate('members.userId', 'username level rank');
  if (!guild) throw new Error('Guild not found');

  const sorted = [...guild.members].sort(
    (a, b) => (b.contributionXP || 0) - (a.contributionXP || 0)
  );

  return sorted.map((m, i) => ({
    rank:          i + 1,
    userId:        m.userId._id ?? m.userId,
    username:      m.userId.username ?? 'Unknown',
    level:         m.userId.level    ?? null,
    rankTier:      m.userId.rank     ?? null,
    role:          m.role,
    contributionXP: m.contributionXP || 0,
    joinedAt:      m.joinedAt,
  }));
};

// ── Exports ───────────────────────────────────────────────────────────────────

module.exports = {
  createGuild,
  joinGuild,
  leaveGuild,
  addGuildXP,
  trackContribution,
  getGuildLevel,
  getGuildLeaderboard,
  GUILD_ROLES,
  GUILD_LEVEL_REWARDS,
};
