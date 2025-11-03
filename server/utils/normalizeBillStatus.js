/**
 * derives a bill's timeline and current status from its recent actions
 * @param {Array<{actionDate: string, text: string}>} actions - the most recent actions for a bill
 * @param {string} actions[].billType - the type of the bill (e.g., "hr", "s", etc.)
 * @returns {{
 *   currentStatus: string,
 *   currentChamber: string,
 *   timeline: { chamber: string, status: string, date: string }[]
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

  for (const { actionDate, text, type } of sorted) {
    const lower = text.toLowerCase();
    let chamber = currentChamber;
    if (lower.includes("senate")) chamber = "Senate";
    else if (lower.includes("house")) chamber = "House";

    let status = "Other";

    // detect primary statuses
    if (lower.includes("introduced")) status = "Introduced";
    else if (lower.includes("committee")) status = "In Committee";
    else if (lower.includes("markup") || lower.includes("mark-up"))
      status = "Committee Markup";
    else if (lower.includes("reported")) status = "Reported by Committee";
    else if (lower.includes("passed/agreed") || lower.includes("passed"))
      status = `Passed ${chamber}`;
    else if (lower.includes("received in the senate"))
      status = "Received in Senate";
    else if (lower.includes("received in the house"))
      status = "Received in House";
    else if (lower.includes("veto")) status = "Vetoed";
    else if (lower.includes("signed by president")) status = "Signed by President";
    else if (lower.includes("became law")) status = "Became Law";
    else if (lower.includes("referred")) status = "Referred";

    // fallback by type
    if (status === "Other") {
      if (type === "IntroReferral") status = "Introduced";
      else if (type === "Committee") status = "In Committee";
      else if (type === "Floor") status = "Floor Action";
      else if (type === "Calendars") status = "On Calendar";
      else if (type === "BecameLaw") status = "Became Law";
    }

    // prevent deuplicate timeline entries since actions can be repetitive
    if (
      !timeline.some(
        (t) => t.chamber === chamber && t.status === status && t.date === actionDate
      )
    ) {
      timeline.push({ date: actionDate, chamber, status });
      currentStatus = status;
      currentChamber = chamber;
    }
  }

  // post-processing for inferred higher level statuses
  const statusText = (() => {
    const hasHousePass = timeline.some((a) => a.status === "Passed House");
    const hasSenatePass = timeline.some((a) => a.status === "Passed Senate");
    const becameLaw = timeline.some((a) => a.status === "Became Law");
    const vetoed = timeline.some((a) => a.status === "Vetoed");

    if (becameLaw) return "Enacted (Became Law)";
    if (vetoed) return "Vetoed by President";
    if (hasHousePass && hasSenatePass) return "Passed Both Chambers";
    if (hasHousePass && currentChamber === "Senate") return "Awaiting Senate Action";
    if (hasSenatePass && currentChamber === "House") return "Awaiting House Action";
    if (currentStatus.startsWith("Passed")) return currentStatus;
    if (timeline.at(-1)?.status === "Introduced") return "Introduced";

    return currentStatus;
  })();

  return {
    currentStatus: statusText,
    currentChamber,
    timeline
  };
}

module.exports = normalizeBillStatus;