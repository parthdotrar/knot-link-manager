const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  profileImage: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  // Used to link the MongoDB user to Firebase Authentication
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true 
  }
}, {
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

module.exports = mongoose.model('User', UserSchema);

