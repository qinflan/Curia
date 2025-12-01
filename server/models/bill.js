const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  congress: Number,
  number: Number,
  type: String,
  title: String,
  originChamber: String,
  updateDate: String,
  latestAction: {
    actionCode: { type: String, default: null },
    actionDate: { type: String, default: null },
    text: { type: String, default: null },
    type: { type: String, default: null },
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
    actionCode: {type: String, default: null},
    actionDate: {type: String, default: null},
    text: {type: String, default: null},
    type: {type: String, default: null},
  }],
  // refactor status normalization to use action code mapping
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

  // metrics
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

// text indexes for quick searches based on keywords
billSchema.index({ title: "text", summary: "text", policyArea: "text" });

module.exports = mongoose.model("Bill", billSchema);
