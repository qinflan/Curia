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
    theme: { 
      type: String, 
      enum: ['light', 'dark'], 
      default: 'light' 
    },
  },
  savedBills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }],
  likedBills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }],
  dislikedBills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }],
  expoPushTokens: {
    type: [String],
    default: []
  },
  inbox: [
  {
    _id: false, // don’t need Mongo to generate its own ObjectId for each notif
    id: { type: String, required: true },   // uuid or billId+timestamp string
    title: { type: String, required: true },
    body: { type: String, required: true },

    bill: { type: mongoose.Schema.Types.ObjectId, ref: "Bill", required: false },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }
],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("User", userSchema);