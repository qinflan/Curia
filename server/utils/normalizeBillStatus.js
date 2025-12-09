const { ACTION_CODE_MAP } = require('../scripts/constants');

/**
 * derives a bill's timeline and current status from its recent actions
 * @param {Array<{actionDate: string, text: string}>} actions - the most recent actions for a bill
 * @param {string} actions[].billType - the type of the bill (e.g., "hr", "s", etc.)
 * @returns {{
 *   currentStatus: string,
 *   currentChamber: string,
 *   timeline: { chamber: string, status: string, date: Date }[]
 * }}
 */
function normalizeBillStatus(actions = [], billType = "") {
  if (!actions.length) {
    return {
      currentStatus: "Unknown",
      currentChamber: "Unknown",
      timeline: []
    };
  }

  // sort actions by date ascending
  const sorted = [...actions].sort(
    (a, b) => new Date(a.actionDate) - new Date(b.actionDate)
  );

  const timeline = [];
  let currentStatus = "Unknown";
  let currentChamber =
    billType.startsWith("S") || billType.toLowerCase().includes("senate")
      ? "Senate"
      : "House";

  for (const { actionDate, actionCode } of sorted) {
    if (!actionCode) continue;

    const mappedStatus = ACTION_CODE_MAP[actionCode];
    if (!mappedStatus) continue;

    let chamber = currentChamber;
    if (mappedStatus.includes("senate")) chamber = "Senate";
    else if (mappedStatus.includes("house")) chamber = "House";

    // prevent duplicate timeline entries since actions can be repetitive
    if (
      !timeline.some(
        (t) => t.chamber === chamber && t.status === mappedStatus && t.date.getTime() === actionDate.getTime()
      )
    ) {
      timeline.push({ date: actionDate, chamber, status: mappedStatus });
      currentStatus = mappedStatus;
      currentChamber = chamber;
    }
  }

  // post-processing for inferred higher level statuses
  const statusText = (() => {
    const hasHousePass = timeline.some((a) => a.status === "Passed House");
    const hasSenatePass = timeline.some((a) => a.status === "Passed Senate");
    const becameLaw = timeline.some((a) => a.status === "Became Law");
    const vetoed = timeline.some((a) => a.status === "Vetoed");
    
    let statusText = currentStatus;

    if (becameLaw) return "Enacted (Became Law)";
    if (vetoed) return "Vetoed by President";
    if (hasHousePass && hasSenatePass) return "Passed Both Chambers";
    if (hasHousePass && currentChamber === "Senate") return "Awaiting Senate Action";
    if (hasSenatePass && currentChamber === "House") return "Awaiting House Action";

    return statusText;
  })();

  return {
    currentStatus: statusText,
    currentChamber,
    timeline
  };
}

module.exports = normalizeBillStatus;