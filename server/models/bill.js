const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  congress: Number,
  number: Number,
  type: String,
  title: String,
  originChamber: String,
  updateDate: String,
  latestAction: {
    actionDate: String,
    text: String
  },
  url: String,
  policyArea: String,
  shortSummary: {type: String, default: ""},
  summary: String,
  sponsors: [{
    bioguideId: String,
    firstName: String,
    lastName: String,
    state: String,
    party: String,
  }],
  cosponsors: [{
    bioguideId: String,
    firstName: String,
    lastName: String,
    state: String,
    party: String,
    sponsorshipDate: String,
  }],
  actions: [{
    actionDate: {type: String, default: null},
    text: {type: String, default: null},
    type: {type: String, default: null},
  }],
  status: {
    currentChamber: String,
    currentStatus: String,
    timeline: [{
      chamber: String,
      status: String,
      date: String,
    }],
    becameLaw: Boolean,
    vetoed: Boolean,
  },
  enriched: { type: Boolean, default: false }, // flag additional bill data pull from api for filtering

  // metrics
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

module.exports = mongoose.model("Bill", billSchema);
