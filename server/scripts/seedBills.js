const Bill = require("../models/bill");
const User = require("../models/user");
const axios = require("axios");
const dotenv = require("dotenv");
const { parse }  = require("node-html-parser")

const normalizeBillStatus = require("../utils/normalizeBillStatus");
const { sendPushNotification } = require('../services/pushNotification');
const addNotificationToInbox = require('../services/addNotification');

const ACTION_CODE_MAP = require('./constants').ACTION_CODE_MAP;

dotenv.config();

const API_KEY = process.env.CONGRESS_GOV_API_KEY;
const CONGRESS_BASE_URL = "https://api.congress.gov/v3";

const fetchBills = async ({fromDateTime, toDateTime, limit = 250, maxBills = 500}) => {
    const bills = [];
    let offset = 0;

    while (bills.length < maxBills) {
        try {
            const response = await axios.get(`${CONGRESS_BASE_URL}/bill`, {
                params: {
                    api_key: API_KEY,
                    sort: "updateDate+desc",
                    limit,
                    offset,
                    fromDateTime,
                    toDateTime
                }
            });
            const pageBills = response.data.bills || [];
            if (!pageBills.length) break;

            bills.push(...pageBills);

            // stop if fewer than limit (last page)
            if (pageBills.length < limit) break;

            offset += limit; // move to next page
            console.log(offset, bills.length, 'bills fetched so far');
        } catch (error) {
            console.error("Error fetching recent bills:", error);
            break;
        }
    }
    return bills;
};

const getLatestBillUpdate = async () => {
  const latestBill = await Bill.findOne().sort({ updateDate: -1 }).limit(1);
  return latestBill ? latestBill.updateDate : null;
};

const fetchIncrementalBills = async (batchDays = 2) => {
  const latestUpdate = await getLatestBillUpdate();
  let fromDateTime;
  if (latestUpdate) {
    fromDateTime = new Date(new Date(latestUpdate).getTime() + 1000).toISOString().replace(/\.\d{3}Z$/, 'Z')
  } else {
    // rollback to last month of bills to avoid api limiting on empty DB
    fromDateTime = new Date(Date.now() - batchDays * 24 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z');
  }

  const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  return await fetchBills({ fromDateTime, toDateTime: now, maxBills: 500 });
};

const fetchHistoricBillsChunk = async (toDateTime, windowDays = 2) => {
  const fromDateTime = new Date(toDateTime);
  fromDateTime.setDate(fromDateTime.getDate() - windowDays);

  return await fetchBills({ 
    fromDateTime: fromDateTime.toISOString().replace(/\.\d{3}Z$/, 'Z'), 
    toDateTime: toDateTime.toISOString().replace(/\.\d{3}Z$/, 'Z'),
    limit: 250
  });
};

const enrichBills = async (apiBills) => {
    for (const b of apiBills) {
        try {
            const dbBill = await Bill.findOne({
                congress: b.congress,
                number: b.number,
                type: b.type
            });

            if (dbBill && new Date(b.updateDate) <= new Date(dbBill.updateDate)) {
                continue; // nothing to update so skip
            }

            const enrichBillBaseUrl = `${CONGRESS_BASE_URL}/bill/${b.congress}/${b.type.toLowerCase()}/${b.number}`;

            const [resBillDetails, resBillCosponsors, resBillSummaries, resBillActions, resBillTexts] = await Promise.all([
                axios.get(enrichBillBaseUrl, { params: { api_key: API_KEY } }),
                axios.get(`${enrichBillBaseUrl}/cosponsors`, { params: { api_key: API_KEY, limit: 250 } }),
                axios.get(`${enrichBillBaseUrl}/summaries`, { params: { api_key: API_KEY, limit: 250 } }),
                axios.get(`${enrichBillBaseUrl}/actions`, { params: { api_key: API_KEY, limit: 250 } }),
                axios.get(`${enrichBillBaseUrl}/text`, { params: { api_key: API_KEY, limit: 250 } }),
            ]);

            const detailed = resBillDetails.data.bill;
            const policyArea = detailed.policyArea?.name || null;

            const sponsors = normalizeSponsors(detailed.sponsors);
            const cosponsors = normalizeCosponsors(resBillCosponsors.data.cosponsors);

            const summaries = resBillSummaries.data.summaries || [];
            const latestSummary = summaries.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))[0];

            const actions = normalizeActions(resBillActions.data.actions);
            const latestAction = actions.length ? actions[actions.length - 1] : {};

            let pdfTextUrl = null;
            for (const version of resBillTexts.data.textVersions) {
                const pdf = version.formats.find(f => f.type === "PDF");
                if (pdf) {
                    pdfTextUrl = pdf.url;
                    break;
                }
            }

            // send push notifications for significant actions
            // compare latest action date with dbBill latest action date to determine if we need to send notifs
            if (!dbBill || new Date(latestAction.actionDate) > new Date(dbBill.latestAction?.actionDate || 0)) {
                const significantText = ACTION_CODE_MAP[latestAction.actionCode];

                if (significantText) {
                    const usersToNotify = dbBill ? await User.find({ savedBills: dbBill._id }) : [];

                    if (usersToNotify.length === 0) {
                        continue;
                    } else {
                        for (const user of usersToNotify) {
                            // send push if they have tokens
                            if (user.expoPushTokens?.length > 0) {
                                await sendPushNotification(user.expoPushTokens, {
                                    title: `Update for ${b.title}`,
                                    body: significantText,
                                    data: { billId: dbBill._id, latestActionCode: latestAction.actionCode }
                                });
                            }

                            // add notification to inbox
                            await addNotificationToInbox(user._id, {
                                title: b.title,
                                body: significantText,
                                billId: dbBill._id
                            });
                        };
                    }
                };
            }
            const status = normalizeBillStatus(actions, b.type);

            // use regex to get meaningful summaries (second html element)
            const {shortSummary, summary } = normalizeSummaries(latestSummary);

            await Bill.updateOne(
                { congress: b.congress, number: b.number, type: b.type },
                {
                    $set: {
                        title: b.title,
                        originChamber: b.originChamber,
                        updateDate: b.updateDate,
                        latestAction,
                        document: pdfTextUrl,
                        type: b.type,
                        policyArea,
                        summary,
                        sponsors,
                        cosponsors,
                        actions,
                        status,
                        shortSummary,
                    }
                },
                { upsert: true }
            );
            console.log(`Enriched ${b.type.toUpperCase()} ${b.number}`);
        } catch (err) {
            console.error(`Error enriching ${b.type}-${b.number}:`, err);
        }
    }
};

const normalizeSponsors = (sponsors) => {
    return (sponsors || []).map(s => ({
        bioguideId: s.bioguideId,
        firstName: s.firstName,
        lastName: s.lastName,
        state: s.state,
        party: s.party,
    }));
};

const normalizeCosponsors = (cosponsors) => {
    return (cosponsors || []).map(c => ({
        bioguideId: c.bioguideId,
        firstName: c.firstName,
        lastName: c.lastName,
        state: c.state,
        party: c.party,
        sponsorshipDate: c.sponsorshipDate,
    }));
};

const normalizeActions = (actions) => {
    if (typeof actions === "string") {
        try {
            actions = JSON.parse(actions);
        } catch (e) {
            console.error("Failed to parse actions string:", actions);
            actions = [];
        }
    }

    if (!Array.isArray(actions)) {
        return [];
    }

    const normalizedActions = (actions || [])
        .filter(a => a.actionCode && a.actionDate)
        .map(a => ({
            actionCode: a.actionCode,
            actionDate: a.actionDate,
            type: a.type,
            text: a.text,
        }))
        .sort((a, b) => new Date(a.actionDate) - new Date(b.actionDate));

    return normalizedActions;
};

// api returns summaries as HTML blobs that maintain a consistent structure; we need to extract the meaningful text
const normalizeSummaries = (summaryObj) => {
    if (!summaryObj) return { shortSummary: "", summary: ""};

    let rawHtml = summaryObj.text || "";
    if (Array.isArray(rawHtml)) rawHtml = rawHtml.join(" ");

    const root = parse(rawHtml);
    const nodes = root.querySelectorAll("p, li");
    const texts = nodes.map(n => n.text.trim()).filter(Boolean);

    if (texts.length === 0) {
        return { shortSummary: "", summary: "" };
    }
    const shortSummary = texts[1] || "";
    const summary = texts
        .slice(1)                            
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    return { shortSummary, summary };
};

module.exports = {
    fetchBills,
    fetchIncrementalBills,
    fetchHistoricBillsChunk,
    enrichBills,
};
