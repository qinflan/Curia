type Timelineitem = {
    chamber: string;
    status: string;
    date: string;
    _id: string
};

type Bill = {
    _id: string;
    title: string;
    policyArea: string;
    summary: string;
    shortSummary: string;
    document: string;
    originChamber: string;
    likes: number;
    dislikes: number;
    republicanCount: number;
    democratCount: number;
    status: {
        currentStatus: string;
        currentChamber: string;
        timeline: [Timelineitem];
    }
};

export { Bill, Timelineitem };