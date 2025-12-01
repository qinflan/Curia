const Bill = require("../models/bill"); 
const User = require("../models/user");
const axios = require("axios");
const dotenv = require("dotenv");
const { convert } = require('html-to-text')

const normalizeBillStatus = require("../utils/normalizeBillStatus");
const { sendPushNotification } = require('../services/pushNotification');

const ACTION_CODE_MAP = require('./constants').ACTION_CODE_MAP;

dotenv.config();

const API_KEY = process.env.CONGRESS_GOV_API_KEY;
const CONGRESS_BASE_URL = "https://api.congress.gov/v3";

const fetchRecentBills = async () => {
    try {
        const response = await axios.get(`${CONGRESS_BASE_URL}/bill`, {
            params: {
                api_key: API_KEY,
                sort: "updateDate desc",
                limit: 250,
            }
        });
        const bills = response.data.bills || [];
        return bills;
    } catch (error) {
        console.error("Error fetching recent bills:", error);
    }
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

                const resBillDetails = await axios.get(enrichBillBaseUrl, {
                    params: { api_key: API_KEY }
                });

                const resBillCosponsors = await axios.get(`${enrichBillBaseUrl}/cosponsors`, {
                    params: { api_key: API_KEY, limit: 250 }
                });

                const resBillSummaries = await axios.get(`${enrichBillBaseUrl}/summaries`, {
                    params: { api_key: API_KEY, limit: 250 }
                });

                const resBillActions = await axios.get(`${enrichBillBaseUrl}/actions`, {
                    params: { api_key: API_KEY, limit: 250 },
                });
                
                const detailed = resBillDetails.data.bill;
                const policyArea = detailed.policyArea?.name || null;

                const sponsors = normalizeSponsors(detailed.sponsors);
                const cosponsors =  normalizeCosponsors(resBillCosponsors.data.cosponsors);

                const summaries = resBillSummaries.data.summaries || [];
                const latestSummary = summaries.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))[0];

                const actions = normalizeActions(resBillActions.data.actions);
                const latestAction = actions.length ? actions[actions.length -1] : {};

                // send push notifications for significant actions
                // compare latest action date with dbBill latest action date to determine if we need to send notifs
                if (!dbBill || new Date(latestAction.actionDate) > new Date(dbBill.latestAction?.actionDate || 0)) {
                    const significantText = ACTION_CODE_MAP[latestAction.actionCode];
                    
                    if (significantText) {
                        const usersToNotify = await User.find({
                            savedBills: dbBill ? dbBill._id : null,
                            expoPushToken: { $exists: true, $ne: null }
                        });

                        const tokens = usersToNotify.map(u => u.expoPushToken).filter(Boolean);

                        if (tokens.length) {
                            await sendPushNotification(tokens, {
                                title: `Update for ${b.title}`,
                                body: significantText,
                                data: { billId: dbBill ? dbBill._id : null, latestActionCode: latestAction.actionCode }
                            });
                        }
                    }
                }
                const status = normalizeBillStatus(actions, b.type);

                // use regex to get meaningful summaries (second html element)
                const summaryText = normalizeSummaries(latestSummary);

                const lines = summaryText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                const summary = lines.slice(1).join(" ").replace(/\s+/g, ' ').trim();
                const shortSummary = extractShortSummary(summary);

                await Bill.updateOne(
                    { congress: b.congress, number: b.number, type: b.type },
                    {
                        $set: {
                            title: b.title,
                            originChamber: b.originChamber,
                            updateDate: b.updateDate,
                            latestAction,
                            url: b.url,
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

const normalizeSummaries = (summaryObj) => {
    if (!summaryObj) return "";

    rawHtml = summaryObj.text || "";
    if (Array.isArray(rawHtml)) rawHtml = rawHtml.join(" ");

    const htmlConvertOptions = { 
        wordwrap: false,
        selectors: [
            { selector: "a", options: { ignoreHref: true }},
        ] 
    }

    return convert(rawHtml, htmlConvertOptions);
}

// gross regex that just works
const extractShortSummary = (text, maxLength = 300) => {
    if (!text) return "";

    let cleanText = text.replace(/\s+/g, " ").trim();

    cleanText = cleanText.replace(/^\(?(sec(tion)?\.?\s*\d+[a-zA-Z]?\)?)/i, "").trim();

    const sentenceMatch = cleanText.match(/.*?[.!?](?:\s|$)/);
    let shortSummary = sentenceMatch ? sentenceMatch[0].trim() : cleanText;

    if (shortSummary.length > maxLength) {
        shortSummary = shortSummary.slice(0, maxLength).trim() + "...";
    }

    return shortSummary;
};

module.exports = {
    fetchRecentBills,
    enrichBills,
};
