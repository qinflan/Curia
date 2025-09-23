const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true
  },
  password: { 
    type: String, 
    required: true 
  },
  setupComplete: {
    type: Boolean,
    default: false
  },
  state: {
    type: String,
    maxLength: 2
  },
  preferences: {
    interests: [String],
    subscription: Boolean,
    notifications: Boolean,
    theme: { 
      type: String, 
      enum: ['light', 'dark'], 
      default: 'light' 
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});