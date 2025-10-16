import Bill from "../models/bill";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.CONGRESS_GOV_API_KEY;
const BASE_URL = "https://api.congress.gov/v3";

const fetchRecentBills = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/bill`, {
            params: {
                api_key: API_KEY,
                sort: "updateDate desc",
                limit: 250,
            }
        });
        const bills = response.data.bills || [];
        console.log(`Fetched ${bills.length} recent bills.`);

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

        console.log("Recent bills have been updated/inserted into the database.");
    } catch (error) {
        console.error("Error fetching recent bills:", error);
    }
};

const enrichBills = async () => {
    const billsToEnrich = await Bill.find({ enriched: { $ne: true } }).limit(50);
        for (const b of billsToEnrich) {
            try {
                const resBillDetails = await axios.get(`${BASE_URL}/bill/${b.congress}/${b.type}/${b.number}`, {
                    params: { api_key: API_KEY }
                });

                const resBillCosponsors = await axios.get(`${BASE_URL}/bill/${b.congress}/${b.type}/${b.number}/cosponsors`, {
                    params: { api_key: API_KEY },
                    limit: 250
                });

                const resBillSummaries = await axios.get(`${BASE_URL}/bill/${b.congress}/${b.type}/${b.number}/summaries`, {
                    params: { api_key: API_KEY },
                    limit: 250
                });
                
                const detailed = resBillDetails.data.bill;
                const policyArea = detailed.policyArea?.name || null;
                const sponsors = normalizeSponsors(detailed.sponsors);
                const cosponsors =  normalizeCosponsors(resBillCosponsors.data.cosponsors);
                const summaries = resBillSummaries.data.summaries || [];
                const latestSummary = summaries.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))[0];
                
                // TODO: add parser for html which will be cleaner
                const summaryText = latestSummary ? latestSummary.text.replace(/<\/?[^>]+(>|$)/g, "") : null;

                await Bill.updateOne(
                    { _id: b._id },
                    {
                        $set: {
                            policyArea,
                            summary: summaryText,
                            sponsors: sponsors,
                            cosponsors: cosponsors,
                            enriched: true,
                        }
                    }
                );

                console.log(`Enriched ${b.type.toUpperCase()} ${b.number}`);
            } catch (err) {
                console.error(`Error enriching ${b.type}-${b.number}:`, err.message);
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

module.exports = {
    fetchRecentBills,
    enrichBills,
};


