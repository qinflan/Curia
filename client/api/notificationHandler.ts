import axios from 'axios';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getToken } from './authHandler';

const API_BASE_URL =
    Platform.OS === "android"
        ? "http://10.0.2.2:3000/api"
        : "http://localhost:3000/api";


export const registerPushToken = async (pushToken: string) => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");
    const response = await axios.post(`${API_BASE_URL}/users/register-push-token`,
        { token: pushToken },
        {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
    return response.data;
}

export const fetchNotifications = async () => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");

    const response = await axios.get(`${API_BASE_URL}/user/notifications`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

export const markNotificationRead = async (notificationId: string) => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");
    const response = await axios.post(`${API_BASE_URL}/user/notifications/mark-read/${notificationId}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

export async function getPushToken() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        const { status: askedStatus } = await Notifications.requestPermissionsAsync();
        if (askedStatus !== 'granted') {
            alert('Failed to get push token');
            return null;
        }
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
}