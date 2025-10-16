const mongoose = require("mongoose");
const {FED_POLICY_AREAS, US_STATES} = require("./enums")

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  password: { 
    type: String, 
    required: true 
  },
  setupComplete: {
    type: Boolean,
    default: false
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    enum: US_STATES
  },
  dateOfBirth: {
    type: Date
  },
  preferences: {
    interests: [{ type: String, enum: FED_POLICY_AREAS }],
    subscription: {
      type: Boolean,
      default: false
    },
    notifications: { // add FCM logic later and likely store a device obj?
      type: Boolean,
      default: false
    }, 
    theme: { 
      type: String, 
      enum: ['light', 'dark'], 
      default: 'light' 
    },
  },
  savedBills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("User", userSchema);