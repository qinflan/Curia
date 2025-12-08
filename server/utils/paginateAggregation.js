

module.exports = async function paginateAggregation(Model, aggregationPipeline, 
    {page = 1, limit = 10} = {}
) {
    page = Math.max(1, page);
    limit = Math.max(1, limit);

    const skip = (page - 1) * limit;

    const paginatedPipeline = [
        ...aggregationPipeline,
        { $sort: { createdAt: -1, _id: 1 } },
        { $skip: skip },
        { $limit: limit }
    ];

    const data = await Model.aggregate(paginatedPipeline);
    const countPipeline = [...aggregationPipeline, { $count: 'totalDocuments' }];

    const countResult = await Model.aggregate(countPipeline);
    const totalDocuments = countResult[0] ? countResult[0].totalDocuments : 0;
    
    return {
        data,
        totalDocuments,
        page,
        limit,
        totalPages: Math.ceil(totalDocuments / limit)
    };

}