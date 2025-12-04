const cron = require('node-cron');
const { fetchRecentBills, enrichBills } = require('./seedBills');

// cron job for polling congres.gov api and fetching/updating bills
cron.schedule('*/60 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running dev bill polling cron...`);

    try {
        const bills = await fetchRecentBills();

        await enrichBills(bills);

        console.log(`[${new Date().toISOString()}] Dev cron finished.`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in dev cron:`, error);
    }
});

(async () => {
    console.log("Running dev cron on startup...");
    const bills = await fetchRecentBills();
    await enrichBills(bills);
})();
