import { getUser } from './authHandler';
import { api } from './axiosInterceptor';

export const fetchSavedBills = async () => {
    const response = await api.get(`/bills/saved`);
    return response.data;
}

export const fetchBillById = async (billId: string) => {
    const response = await api.get(`/bills/${billId}`);
    return response.data;
}

export const saveBill = async (billId: string) => {
    const response = await api.post(`/users/bill/save/${billId}`);
    return response.data;
}

export const unsaveBill = async (billId: string) => {
    const response = await api.delete(`/users/bill/unsave/${billId}`);
    return response.data;
}

export const fetchRecommendedBills = async (page: number) => {
    console.log(page);
    const response = await api.get(`/bills/recommendations`, { params: { page, limit: 25 } });
    return response.data;
}

export const fetchTrendingBills = async (page: number) => {
    const response = await api.get(`/bills/trending`, { params: { page, limit: 25} });
    return response.data;
}

export const likeBill = async (billId: string) => {
    const response = await api.put(`/bills/${billId}/like`);
    return response.data;
}

export const dislikeBill = async (billId: string) => {
    const response = await api.put(`/bills/${billId}/dislike`);
    return response.data;
}

export const unlikeBill = async (billId: string) => {
    const response = await api.put(`/bills/${billId}/unlike`);
    return response.data;
}

export const undislikeBill = async (billId: string) => {
    const response = await api.put(`/bills/${billId}/undislike`);
    return response.data;
}

export const fetchStateReps = async (state: string) => {
    const user = await getUser();
    const response = await api.get(`/bills/reps/${user.state}`);
    return response.data;
}

export const fetchBillsByRep = async (bioguideId: string) => {
    const response = await api.get(`/bills/rep/${bioguideId}`);
    return response.data;
}

export const searchBillsByKeywords = async (keyword: string) => {
    if (!keyword.trim()) {
        return []
    } 

    const response = await api.get(`/bills/search`, {
        params: { keyword: keyword }
    })
    return response.data;
}