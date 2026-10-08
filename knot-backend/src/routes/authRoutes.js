const express = require('express');
const router = express.Router();
const { syncUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

// The frontend handles actual login/signup via Firebase.
// This route is called right after frontend login to ensure the user exists in our MongoDB.
router.post('/sync', authenticate, syncUser);

module.exports = router;