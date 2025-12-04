import * as SecureStore from 'expo-secure-store';
import { api } from './axiosInterceptor';
import { saveToken, getToken, deleteToken } from './tokenStorage';

// auth functions
export const loginUser = async (email: string, password: string) => {
    const response = await api.post(`/users/login`, {email, password});
    const {userId, accessToken, refreshToken } = response.data;

    await saveToken("access_token", accessToken);
    await saveToken("refresh_token", refreshToken);
    await saveToken("user_Id", userId);

    return { userId, accessToken, refreshToken };
};

export const registerUser = async (email: string, password: string) => {
    const response = await api.post(`/users/register`, {email, password});
    const {userId, accessToken, refreshToken } = response.data;

    await saveToken("access_token", accessToken);
    await saveToken("refresh_token", refreshToken);
    await saveToken("user_Id", userId);

    return { userId, accessToken, refreshToken };
};

export const getUser = async () => {
    const accessToken = await getToken("access_token");

    if (!accessToken) throw new Error("No access token stored.");

    const response = await api.get(`/users/me`);

    return response.data;
}

export const refreshAccessToken = async () => {
    const refreshToken = await getToken("refresh_token");
    
    if (!refreshToken) {
        throw new Error("Refresh token not currently stored");
    }
    await api.post(`/users/refresh`);
}

export const logoutUser = async () => {
    await deleteToken("access_token");
    await deleteToken("refresh_token");
    await deleteToken("user_id");
}

export const deleteUser = async () => {
    const accessToken = await getToken("access_token");

    if (!accessToken) {
        throw new Error("Access token not currently stored");
    }

    const response = await api.delete(`/users/delete`);

    await logoutUser();
    return response.data;
}

export const updateUser = async (updates: Record<string, any>) => {
    const accessToken = await getToken("access_token");

    if (!accessToken) {
        throw new Error("Access token not currently stored");
    }

    const response = await api.put(`/users/update`, updates);

    return response.data;
}