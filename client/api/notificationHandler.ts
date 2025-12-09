import axios from 'axios';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getToken } from './tokenStorage';
import { api } from './axiosInterceptor';

export const registerPushToken = async (pushToken: string) => {
    const response = await api.post(`/users/register-push-token`,
        { token: pushToken }
    );
    return response.data;
}

export const fetchNotifications = async () => {
    const response = await axios.get(`/user/notifications`);
    return response.data;
}

export const markNotificationRead = async (notificationId: string) => {
    const accessToken = await getToken("access_token");
    if (!accessToken) throw new Error("No access token stored.");
    const response = await axios.post(`/user/notifications/mark-read/${notificationId}`);
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
            console.warn('Failed to get push token');
            return null;
        }
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
}