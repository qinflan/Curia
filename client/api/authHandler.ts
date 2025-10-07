import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


const API_BASE_URL = "http://localhost:3000/api" // for local development backend api

// device storage helpers for tokens
export const saveToken = async(key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
};

export const getToken = async(key: string) => {
    return await SecureStore.getItemAsync(key);
};

export const deleteToken = async(key: string) => {
    await SecureStore.deleteItemAsync(key);
};

// auth functions
export const loginUser = async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/users/login`, {email, password});
    const {userId, accessToken, refreshToken } = response.data;

    await saveToken("access_token", accessToken);
    await saveToken("refresh_token", refreshToken);
    await saveToken("user_Id", userId);

    return { userId, accessToken, refreshToken };
};

export const registerUser = async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/users/register`, {email, password});
    const {userId, accessToken, refreshToken } = response.data;

    await saveToken("access_token", accessToken);
    await saveToken("refresh_token", refreshToken);
    await saveToken("user_Id", userId);

    return { userId, accessToken, refreshToken };
};

export const getUser = async () => {
    const accessToken = await getToken("access_token");

    if (!accessToken) throw new Error("No access token stored.");

    const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    return response.data;
}

export const refreshAccessToken = async () => {
    const refreshToken = await getToken("refresh_token");
    
    if (!refreshToken) {
        throw new Error("Refresh token not currently stored");
    }

    const response = await axios.post(`${API_BASE_URL}/users/refresh`, {}, {
        headers: { Authorization: `Bearer ${refreshToken}`}
    });
    const { accessToken } = response.data;

    await saveToken("access_token", accessToken);

    return accessToken;
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

    const response = await axios.delete(`${API_BASE_URL}/users/delete`, {
        headers: { Authorization: `Bearer ${accessToken}`}
    });

    await logoutUser();
    return response.data;
}

export const updateUser = async (updates: Record<string, any>) => {
    const accessToken = await getToken("access_token");

    if (!accessToken) {
        throw new Error("Access token not currently stored");
    }

    const response = await axios.put(`${API_BASE_URL}/users/update`,
        updates,
        {
            headers: { Authorization: `Bearer ${accessToken}`}
        }
    );

    return response.data;
}