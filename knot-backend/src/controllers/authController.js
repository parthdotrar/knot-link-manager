const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Sync Firebase User with MongoDB
const syncUser = asyncHandler(async (req, res) => {
  // req.user comes from the authMiddleware (decoded Firebase token)
  const { uid, email, name, picture } = req.user;

  // Check if user already exists in MongoDB
  let user = await User.findOne({ firebaseUid: uid });

  if (!user) {
    // Generate a default username from email (e.g., john.doe@gmail.com -> john.doe)
    // We add a random string to ensure it's unique
    const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const username = `${baseUsername}${uniqueSuffix}`;

    // Create new user in MongoDB
    user = await User.create({
      firebaseUid: uid,
      email: email,
      name: name || email.split('@')[0], // Fallback if name is missing
      username: username,
      profileImage: picture || ''
    });
  }

  res.status(200).json({ success: true, data: user });
});

module.exports = { syncUser };