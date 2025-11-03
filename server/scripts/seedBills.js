const Bill = require("../models/bill"); 
const axios = require("axios");
const dotenv = require("dotenv");
const normalizeBillStatus = require("../utils/normalizeBillStatus");
const { convert } = require('html-to-text')

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

        for (const bill of bills) {
            await Bill.updateOne(
                { congress: bill.congress, number: bill.number, type: bill.type },

                { 
                    $set: {
                        title: bill.title,
                        originChamber: bill.originChamber,
                        updateDate: bill.updateDate,
                        latestAction: bill.latestAction,
                        url: bill.url,
                        type: bill.type,
                    }
                },
                { upsert: true }
            );
        }

    } catch (error) {
        console.error("Error fetching recent bills:", error);
    }
};

const enrichBills = async () => {
    const billsToEnrich = await Bill.find({ enriched: { $ne: true } }).limit(50);
    console.log(`Found ${billsToEnrich.length} bills to enrich.`);
        for (const b of billsToEnrich) {
            try {

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
                const status = normalizeBillStatus(actions, b.type);

                // console.log(`Normalized status for ${b.type.toUpperCase()} ${b.number}:`, status);

                // use regex to get meaningful summaries (second html element)
                const summaryText = normalizeSummaries(latestSummary);

                const lines = summaryText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                const summary = lines.slice(1).join(" ").replace(/\s+/g, ' ').trim();

                const shortSummaryMatch = summary.match(/.*?[.!?](?:\s|$)/);
                const shortSummary = shortSummaryMatch ? shortSummaryMatch[0].trim() : "";

                // console.log(summary);

                await Bill.updateOne(
                    { _id: b._id },
                    {
                        $set: {
                            policyArea,
                            summary,
                            sponsors,
                            cosponsors,
                            enriched: true,
                            actions,
                            status,
                            shortSummary,
                        }
                    }
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

    const normalizedActions = (actions || []).map(a => ({
        actionDate: a.actionDate,
        type: a.type,
        text: a.text,
    }));

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

module.exports = {
    fetchRecentBills,
    enrichBills,
};
