import axios from 'axios';
import { Platform } from 'react-native';
import { getToken } from './tokenStorage';
import { getUser } from './authHandler';
import { api } from './axiosInterceptor';

// adjust after deploying backend
const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/api"
    : "http://localhost:3000/api";


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

export const fetchRecommendedBills = async () => {
    const response = await api.get(`/bills/recommendations`);
    return response.data;
}

export const fetchTrendingBills = async () => {
    const response = await api.get(`/bills/trending`);
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
        params: { keyword: keyword}
    })
    return response.data;
}