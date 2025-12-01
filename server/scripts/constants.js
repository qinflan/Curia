
// mapping of action codes for US federal legislation
// the codes the API returns is very inconsistent as time passes, so this likely needs updates over time
exports.ACTION_CODE_MAP = {
  "1000": "Bill introduced in House",
  "Intro-H": "introducedHouse", // older
  "10000": "Bill introduced in Senate",
  "Intro-S": "introducedSenate", // older

  "5000": "Reported to House",
  "14000": "Reported to Senate",

  "8000": "Passed House",
  "17000": "Passed Senate",

  "21000": "Conference report agreed to in House",
  "23000": "Conference report agreed to in Senate",

  "28000": "Presented to President",
  "29000": "Signed by President",
  "36000": "Became Public Law",
};