import axios from 'axios';
import { Platform } from 'react-native';
import { getToken, getUser } from './authHandler';

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/api"
    : "http://localhost:3000/api";


export const fetchSavedBills = async () => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");

    const response = await axios.get(`${API_BASE_URL}/bills/saved`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

export const fetchBillById = async (billId: string) => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");

    const response = await axios.get(`${API_BASE_URL}/bills/${billId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

export const saveBill = async (billId: string) => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");   
    const response = await axios.post(`${API_BASE_URL}/users/bill/save/${billId}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

export const unsaveBill = async (billId: string) => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");
    const response = await axios.delete(`${API_BASE_URL}/users/bill/unsave/${billId}`,
        {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

export const fetchRecommendedBills = async () => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored."); 
    const response = await axios.get(`${API_BASE_URL}/bills/recommendations`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

export const fetchTrendingBills = async () => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");
    const response = await axios.get(`${API_BASE_URL}/bills/trending`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

export const likeBill = async (billId: string) => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");
    const response = await axios.put(`${API_BASE_URL}/bills/${billId}/like`, {}, { 
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

export const dislikeBill = async (billId: string) => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");
    const response = await axios.put(`${API_BASE_URL}/bills/${billId}/dislike`, {}, {    
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

export const unlikeBill = async (billId: string) => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");
    const response = await axios.put(`${API_BASE_URL}/bills/${billId}/unlike`, {}, { 
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

export const undislikeBill = async (billId: string) => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");
    const response = await axios.put(`${API_BASE_URL}/bills/${billId}/undislike`, {}, {    
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

export const fetchStateReps = async (state: string) => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");

    const user = await getUser();
    const response = await axios.get(`${API_BASE_URL}/bills/reps/${user.state}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

export const fetchBillsByRep = async (bioguideId: string) => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");

    const response = await axios.get(`${API_BASE_URL}/bills/rep/${bioguideId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

export const searchBillsByKeywords = async (keyword: string) => {
    if (!keyword.trim()) {
        return []
    }

    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");

    const response = await axios.get(`${API_BASE_URL}/bills/search`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { keyword: keyword}
    })
    return response.data;
}