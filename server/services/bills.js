const Bill = require("../models/bill");
const User = require("../models/user");
const mongoose = require("mongoose");
const { buildBillAggregation } = require("../utils/billAggregation")

class BillService {
    async getBillsByPolicyAreas(req, res) {
        try {
            const userId = req.user.userId;
            const user = await User.findById(userId).select('preferences.interests');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const interests = user.preferences?.interests || [];

            const pipeline = buildBillAggregation([
                { $match: { policyArea: { $in: interests } } }
            ]);

            const bills = await Bill.aggregate(pipeline);
            res.status(200).json(bills);
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async getSavedBills(req, res) {
        try {
            const userId = req.user.userId;
            const user = await User.findById(userId).select('savedBills');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const savedBillIds = user.savedBills || [];
            if (savedBillIds.length === 0) {
                return res.status(200).json([]);
            }
            const savedBillObjectIds = savedBillIds.map(id => new mongoose.Types.ObjectId(id));

            const pipeline = buildBillAggregation([
                { $match: { _id: { $in: savedBillObjectIds } } }
            ]);

            const bills = await Bill.aggregate(pipeline);
            res.status(200).json(bills);
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async getBillById(req, res) {
        try {
            const { billId } = req.params;
            if (!billId) {
                return res.status(400).json({ message: "billId is required" });
            }

            const pipeline = buildBillAggregation([
                { $match: { _id: new mongoose.Types.ObjectId(billId) } }
            ]);
            const bills = await Bill.aggregate(pipeline);
            if (bills.length === 0) {
                return res.status(404).json({ message: "Bill not found" });
            }
            res.status(200).json(bills[0]);

        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async likeBill(req, res) {
        const userId = req.user.userId;
        const { billId } = req.params;

        console.log("billId from params:", billId);
        console.log("type:", typeof billId);

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }


            const bill = await Bill.findById(billId);
            if (!bill) {
                return res.status(404).json({ message: 'Bill not found' });
            }

            const alreadyLiked = user.likedBills.some(id => id.equals(bill._id));
            const alreadyDisliked = user.dislikedBills.some(id => id.equals(bill._id));

            if (alreadyLiked) {
                return res.status(400).json({ message: 'Bill already liked' });
            }

            user.likedBills.push(bill._id);
            user.dislikedBills = user.dislikedBills.filter(id => !id.equals(bill._id));
            await user.save();

            bill.likes += 1;
            if (bill.dislikes > 0 && alreadyDisliked) {
                bill.dislikes -= 1;
            }
            await bill.save();

            return res.status(200).json({ message: 'Bill liked successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async unlikeBill(req, res) {
        const userId = req.user.userId;
        const { billId } = req.params;

        console.log("billId from params:", billId);
        console.log("type:", typeof billId);

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const bill = await Bill.findById(billId);
            if (!bill) {
                return res.status(404).json({ message: 'Bill not found' });
            }

            const likedIndex = user.likedBills.findIndex(id => id.equals(bill._id));
            if (likedIndex === -1) {
                return res.status(400).json({ message: 'Bill not liked yet' });
            }
            user.likedBills.splice(likedIndex, 1);
            await user.save();

            if (bill.likes > 0) bill.likes -= 1;
            await bill.save();

            return res.status(200).json({ message: 'Bill unliked successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async dislikeBill(req, res) {
        const userId = req.user.userId;
        const { billId } = req.params;

        console.log("billId from params:", billId);
        console.log("type:", typeof billId);

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const bill = await Bill.findById(billId);
            if (!bill) {
                return res.status(404).json({ message: 'Bill not found' });
            }

            const alreadyLiked = user.likedBills.some(id => id.equals(bill._id));
            const alreadyDisliked = user.dislikedBills.some(id => id.equals(bill._id));

            if (alreadyDisliked) {
                return res.status(400).json({ message: 'Bill already disliked' });
            }

            user.dislikedBills.push(bill._id);
            user.likedBills = user.likedBills.filter(id => !id.equals(bill._id));
            await user.save();

            bill.dislikes += 1;
            if (bill.likes > 0 && alreadyLiked) {
                bill.likes -= 1;
            }
            await bill.save();

            return res.status(200).json({ message: 'Bill disliked successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async undislikeBill(req, res) {
        const userId = req.user.userId;
        const { billId } = req.params;

        console.log("billId from params:", billId);
        console.log("type:", typeof billId);

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const bill = await Bill.findById(billId);
            if (!bill) {
                return res.status(404).json({ message: 'Bill not found' });
            }

            const dislikedIndex = user.dislikedBills.findIndex(id => id.equals(bill._id));
            if (dislikedIndex === -1) {
                return res.status(400).json({ message: 'Bill not disliked yet' });
            }
            user.dislikedBills.splice(dislikedIndex, 1);
            await user.save();

            if (bill.dislikes > 0) bill.dislikes -= 1;
            await bill.save();

            return res.status(200).json({ message: 'Bill undisliked successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async getTrendingBills(req, res) {
        try {
            const pipeline = buildBillAggregation([
                {
                $addFields: {
                    engagement: { $add: ["$likes", "$dislikes"] }
                }
            },
                { $sort: { engagement: -1 } },
                { $limit: 100 }
            ]);

            const bills = await Bill.aggregate(pipeline);
            res.status(200).json(bills);

        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async getStateReps(req, res) {
        try {
            const { state } = req.params;
            const sponsors = await Bill.aggregate([
            { $match: { "sponsors.state": state }},
            { $unwind: "$sponsors" },
            { $match: { "sponsors.state": state }},
            { 
                $group: {
                _id: "$sponsors.bioguideId",
                firstName: { $first: "$sponsors.firstName" },
                lastName: { $first: "$sponsors.lastName" },
                party: { $first: "$sponsors.party" },
                state: { $first: "$sponsors.state" }
                }
            }
            ]);

            const cosponsors = await Bill.aggregate([
            { $match: { "cosponsors.state": state }},
            { $unwind: "$cosponsors" },
            { $match: { "cosponsors.state": state }},
            { 
                $group: {
                _id: "$cosponsors.bioguideId",
                firstName: { $first: "$cosponsors.firstName" },
                lastName: { $first: "$cosponsors.lastName" },
                party: { $first: "$cosponsors.party" },
                state: { $first: "$cosponsors.state" }
                }
            }
            ]);

            const reps = [...sponsors, ...cosponsors].reduce((acc, rep) => {
            acc[rep._id] = rep;
            return acc;
            }, {});

            res.status(200).json(Object.values(reps));

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", err });
        }
    }

    async getBillsByStateRep(req, res) {
        try {
            const { bioguideId } = req.params;

            if (!bioguideId) {
                return res.status(400).json({ message: "bioguideId is required" });
            }

            const pipeline = buildBillAggregation([
                {
                    $match: {
                        $or: [
                            { "sponsors.bioguideId": bioguideId },
                            { "cosponsors.bioguideId": bioguideId }
                        ]
                    }
                }
            ]);
            const bills = await Bill.aggregate(pipeline);
            res.status(200).json(bills);

        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async getBillsByKeywords(req, res) {
       try {
            const { keyword } = req.query;
            if (!keyword || keyword.trim() === "") {
                return res.status(400).json({ message: "Keyword is required" });
            }

            const pipeline = buildBillAggregation([
                {
                    $match: {
                        $text: { $search: keyword }
                    }
                },
                {
                    $addFields: { score: { $meta: "textScore" } }
                },
                {
                    $sort: { score: { $meta: "textScore" } }
                },
                { $limit: 100 }
            ]);

            const bills = await Bill.aggregate(pipeline);
            res.status(200).json(bills);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error", error });
        }
    }
}

module.exports = new BillService();