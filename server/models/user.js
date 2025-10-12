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
  lastname: {
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
  city: { // add sanitization and do dropdown autocomplete on frontend (this can be used for fetching state legislation based on city)
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
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("User", userSchema);