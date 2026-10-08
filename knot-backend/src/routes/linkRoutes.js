const express = require('express');
const router = express.Router();
const { getLinks, createLink, updateLink, deleteLink, getPublicLinks } = require('../controllers/linkController');
const { authenticate } = require('../middleware/authMiddleware');

// Public endpoint: Get links by username MUST be BEFORE authenticate middleware
router.get('/public/:username', getPublicLinks);

// Protect all other routes in this file with Firebase token verification
router.use(authenticate);

// Get all links for logged-in user
router.get('/', getLinks);

// Create new link
router.post('/', createLink);

// Update link
router.put('/:id', updateLink);

// Delete link
router.delete('/:id', deleteLink);

module.exports = router;