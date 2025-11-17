const Bill = require("../models/bill");
const User = require("../models/user");
const mongoose = require("mongoose");
const { buildBillAggregation } = require("../utils/billAggregation")


// TODO: return data aggregation is super repetitive so refactor it to make this more clean 
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
                return res.status(400).json({ message: 'Bill not liked yet' });
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
                { $sort: { likes: -1 } },
                { $limit: 100 }
            ]);

            const bills = await Bill.aggregate(pipeline);
            res.status(200).json(bills);

        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async getBillByStateReps(req, res) {
        try {
            const { state } = req.params;
            const pipeline = buildBillAggregation([
                {
                    $match: {
                        $or: [
                            { "sponsors.state": state },
                            { "cosponsors.state": state }
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