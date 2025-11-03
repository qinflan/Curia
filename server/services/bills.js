const Bill = require("../models/bill");
const User = require("../models/user");
const mongoose = require("mongoose");

class BillService {
    async getBillsByPolicyAreas(req, res) {
        try {
            const userId = req.user.userId;
            const user = await User.findById(userId).select('preferences.interests');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const interests = user.preferences?.interests || [];

            const bills = await Bill.aggregate([
                { $match: { policyArea: { $in: interests } } },

                {
                    $addFields: {
                        allSponsors: { $concatArrays: ["$sponsors", "$cosponsors"] }
                    }
                },

                {
                    $addFields: {
                        republicanCount: {
                            $size: {
                                $filter: {
                                    input: "$allSponsors", as: "s", cond: { $eq: ["$$s.party", "R"] }
                                }
                            }
                        },
                        democratCount: {
                            $size: {
                                $filter: {
                                    input: "$allSponsors", as: "s", cond: { $eq: ["$$s.party", "D"] }
                                }
                            }
                        }
                    },
                },

                {
                    $addFields: {
                        recentActions: {
                            $slice: [
                                { $reverseArray: { $sortArray: { input: "$actions", sortBy: { actionDate: 1 } } } },
                                10
                            ]
                        }
                    }
                },

                {
                    $project: {
                        title: 1,
                        summary: 1,
                        policyArea: 1,
                        number: 1,
                        type: 1,
                        url: 1,
                        republicanCount: 1,
                        democratCount: 1,
                        likes: 1,
                        dislikes: 1,
                        recentActions: 1,
                    }
                }
            ]);

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
            console.log("savedBillObjectIds:", savedBillObjectIds);
            const bills = await Bill.aggregate([
                { $match: { _id: { $in: savedBillObjectIds } } },

                {
                    $addFields: {
                        allSponsors: { $concatArrays: ["$sponsors", "$cosponsors"] }
                    }
                },

                {
                    $addFields: {
                        republicanCount: {
                            $size: {
                                $filter: {
                                    input: "$allSponsors", as: "s", cond: { $eq: ["$$s.party", "R"] }
                                }
                            }
                        },
                        democratCount: {
                            $size: {
                                $filter: {
                                    input: "$allSponsors", as: "s", cond: { $eq: ["$$s.party", "D"] }
                                }
                            }
                        }
                    },
                },

                {
                    $addFields: {
                        recentActions: {
                            $slice: [
                                { $reverseArray: { $sortArray: { input: "$actions", sortBy: { actionDate: 1 } } } },
                                10
                            ]
                        }
                    }
                },

                {
                    $project: {
                        title: 1,
                        summary: 1,
                        policyArea: 1,
                        number: 1,
                        type: 1,
                        url: 1,
                        republicanCount: 1,
                        democratCount: 1,
                        likes: 1,
                        dislikes: 1,
                        recentActions: 1,
                    }
                }
            ]);

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

    async getTrendingBills(req, res) {
        try {
            const bills = await Bill.aggregate([
                { $sort: { likes: -1 } },
                { $limit: 100 },

                {
                    $addFields: {
                        allSponsors: { $concatArrays: ["$sponsors", "$cosponsors"] }
                    }
                },

                {
                    $addFields: {
                        republicanCount: {
                            $size: {
                                $filter: { input: "$allSponsors", as: "s", cond: { $eq: ["$$s.party", "R"] } }
                            }
                        },
                        democratCount: {
                            $size: {
                                $filter: { input: "$allSponsors", as: "s", cond: { $eq: ["$$s.party", "D"] } }
                            }
                        }
                    }
                },

                {
                    $addFields: {
                        recentActions: {
                            $slice: [
                                { $reverseArray: { $sortArray: { input: "$actions", sortBy: { actionDate: 1 } } } },
                                10
                            ]
                        }
                    }
                },

                {
                    $project: {
                        title: 1,
                        summary: 1,
                        policyArea: 1,
                        number: 1,
                        type: 1,
                        url: 1,
                        republicanCount: 1,
                        democratCount: 1,
                        likes: 1,
                        dislikes: 1,
                        recentActions: 1,
                    }
                }
            ]);

            res.status(200).json(bills);
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async getBillByStateReps(req, res) {
        try {
            const { state } = req.params;
            const bills = await Bill.aggregate([
                {
                    $match: {
                        $or: [
                            { "sponsors.state": state },
                            { "cosponsors.state": state }
                        ]
                    }
                },
                {
                    $addFields: {
                        allSponsors: { $concatArrays: ["$sponsors", "$cosponsors"] }
                    }
                },
                {
                    $addFields: {
                        republicanCount: {
                            $size: {
                                $filter: { input: "$allSponsors", as: "s", cond: { $eq: ["$$s.party", "R"] } }
                            }
                        },
                        democratCount: {
                            $size: {
                                $filter: { input: "$allSponsors", as: "s", cond: { $eq: ["$$s.party", "D"] } }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        recentActions: {
                            $slice: [
                                { $reverseArray: { $sortArray: { input: "$actions", sortBy: { actionDate: 1 } } } },
                                10
                            ]
                        }
                    }
                },

                {
                    $project: {
                        title: 1,
                        summary: 1,
                        policyArea: 1,
                        number: 1,
                        type: 1,
                        url: 1,
                        republicanCount: 1,
                        democratCount: 1,
                        likes: 1,
                        dislikes: 1,
                        recentActions: 1,
                    }
                }
            ]);

            res.status(200).json(bills);
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
}

module.exports = new BillService();