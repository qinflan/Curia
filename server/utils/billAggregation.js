/* This file can be used to avoid redundant data aggregation code when retrieving bills **/

module.exports.buildBillAggregation = function (initialStages = []) {
    return [
        ...initialStages,

        // Combine sponsors + cosponsors
        {
            $addFields: {
                allSponsors: { $concatArrays: ["$sponsors", "$cosponsors"] }
            }
        },

        // Count R/D
        {
            $addFields: {
                republicanCount: {
                    $size: {
                        $filter: {
                            input: "$allSponsors",
                            as: "s",
                            cond: { $eq: ["$$s.party", "R"] }
                        }
                    }
                },
                democratCount: {
                    $size: {
                        $filter: {
                            input: "$allSponsors",
                            as: "s",
                            cond: { $eq: ["$$s.party", "D"] }
                        }
                    }
                }
            }
        },

        // Slice recent actions
        {
            $addFields: {
                recentActions: {
                    $slice: [
                        { 
                            $reverseArray: { 
                                $sortArray: { 
                                    input: "$actions", 
                                    sortBy: { actionDate: 1 } 
                                } 
                            } 
                        },
                        10
                    ]
                }
            }
        },

        // Must have summary
        { 
            $match: { shortSummary: { $exists: true, $ne: "" } } 
        },

        // Final shape
        {
            $project: {
                _id: 1,
                title: 1,
                summary: 1,
                shortSummary: 1,
                status: 1,
                originChamber: 1,
                policyArea: 1,
                number: 1,
                type: 1,
                document: 1,
                republicanCount: 1,
                democratCount: 1,
                likes: 1,
                dislikes: 1,
                recentActions: 1
            }
        }
    ];
};
