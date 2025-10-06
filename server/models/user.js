const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    },
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("User", userSchema);