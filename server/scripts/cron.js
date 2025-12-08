const cron = require('node-cron');
const { fetchIncrementalBills, fetchHistoricBillsChunk, enrichBills } = require('./seedBills');
const Bill = require('../models/bill')

// cron job for polling congres.gov api and fetching/updating bills

const runCron = async () => {
    console.log(`[${new Date().toISOString()}] Running congress.gov api fetch cron...`);

    try {
        const newBills = await fetchIncrementalBills();
        console.log('Incremental fetched:', newBills.length);
        if (newBills.length) {
            await enrichBills(newBills);
        }

        const oldestBill = await Bill.findOne().sort({ updateDate: 1 });
        const toDate = oldestBill ? new Date(oldestBill.updateDate) : new Date();
        const historicChunk = await fetchHistoricBillsChunk(toDate, 3); // 3-day window
        if (historicChunk.length) {
        console.log(`Fetched ${historicChunk.length} historic bills`);
        await enrichBills(historicChunk);
        }

        console.log(`[${new Date().toISOString()}] Dev cron finished.`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in dev cron:`, error);
    }
}

// run cron once on startup, then schedule for every hour
runCron();

cron.schedule('0 * * * *', runCron);
