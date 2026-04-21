const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @route POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists', data: null });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      stats: { strength: 0, intelligence: 0, endurance: 0, charisma: 0, focus: 0 },
      xp: 0,
      level: 1,
      rank: 'Bronze Hunter',
      coins: 0,
      streak: 0,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { token, user: { id: user._id, username: user.username, email: user.email, level: user.level, rank: user.rank } },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials', data: null });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials', data: null });

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Login successful',
      data: { token, user: { id: user._id, username: user.username, email: user.email, level: user.level, rank: user.rank } },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route GET /api/auth/me
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('guild', 'name tag');

    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null });

    return res.json({ success: true, message: 'Profile fetched', data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};
