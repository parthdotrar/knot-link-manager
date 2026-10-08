const Link = require('../models/Link');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Get all links for logged-in user
const getLinks = asyncHandler(async (req, res) => {
  if (!req.mongoUserId) return res.status(401).json({ success: false, error: 'User not synced' });
  
  const user = await User.findById(req.mongoUserId);
  const links = await Link.find({ userId: req.mongoUserId }).sort({ order: 1 });
  
  res.json({ success: true, data: links, user: user });
});

// Create new link
const createLink = asyncHandler(async (req, res) => {
  if (!req.mongoUserId) return res.status(401).json({ success: false, error: 'User not synced' });
  const { title, url, icon, order } = req.body;
  const link = await Link.create({
    userId: req.mongoUserId,
    title,
    url,
    icon: icon || '🔗',
    order: order || 0
  });
  res.status(201).json({ success: true, data: link });
});

// Update link
const updateLink = asyncHandler(async (req, res) => {
  const link = await Link.findByIdAndUpdate(
    req.params.id,
    { ...req.body, userId: req.mongoUserId }, // Ensure user owns it
    { new: true, runValidators: true }
  );
  if (!link) {
    return res.status(404).json({ success: false, error: 'Link not found' });
  }
  res.json({ success: true, data: link });
});

// Delete link
const deleteLink = asyncHandler(async (req, res) => {
  const link = await Link.findOneAndDelete({
    _id: req.params.id,
    userId: req.mongoUserId
  });
  if (!link) {
    return res.status(404).json({ success: false, error: 'Link not found' });
  }
  res.json({ success: true, message: 'Link deleted' });
});

// Public endpoint: Get links by username
const getPublicLinks = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    return res.status(404).json({ success: false, error: 'Profile not found' });
  }
  const links = await Link.find({ userId: user._id }).sort({ order: 1 });
  res.json({ success: true, user, data: links });
});

module.exports = {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  getPublicLinks
};