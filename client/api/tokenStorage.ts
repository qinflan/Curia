import * as SecureStore from 'expo-secure-store';

// helpers for token storage/retrieval
export const saveToken = async(key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
};

export const getToken = async(key: string) => {
    return await SecureStore.getItemAsync(key);
};

export const deleteToken = async(key: string) => {
    await SecureStore.deleteItemAsync(key);
};