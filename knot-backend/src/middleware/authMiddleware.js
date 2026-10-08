const admin = require('firebase-admin');
const User = require('../models/User');

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
    });
}

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'No token provided. Please log in.' });
        }

        const idToken = authHeader.split('Bearer ')[1];

        // Verify the ID token with Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        
        // Find MongoDB user by Firebase UID
        let mongoUser = await User.findOne({ firebaseUid: decodedToken.uid });
        
        // Attach to request
        req.user = decodedToken; // Firebase token payload
        if (mongoUser) {
            req.mongoUserId = mongoUser._id; // The MongoDB ObjectId
        }
        
        next(); // Proceed to the actual route
    } catch (error) {
        console.error('Firebase token verification error:', error);
        return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    }
};

module.exports = { authenticate };