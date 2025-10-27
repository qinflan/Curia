const mongoose = require ("mongoose");

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

  //enrichable fields
  policyArea: String,
  summary: String,
  sponsors: [
    {
        bioguideId: String,
        firstName: String,
        lastName: String,
        state: String,
        party: String,
    }
  ],
  cosponsors: [
    {
        bioguideId: String,
        firstName: String,
        lastName: String,
        state: String,
        party: String,
        sponsorshipDate: String,
    }
  ],
  enriched: { type: Boolean, default: false }, // flag additional bill data pull from api for filtering

  // metrics
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

module.exports = mongoose.model("Bill", billSchema);
