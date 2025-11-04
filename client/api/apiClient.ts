import axios from "axios";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { logoutUser } from "./authHandler";

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/api"
    : "http://localhost:3000/api";

// helper functions
const getToken = async (key: string) => await SecureStore.getItemAsync(key);
const saveToken = async (key: string, value: string) => await SecureStore.setItemAsync(key, value);

export const api = axios.create({
  baseURL: API_BASE_URL,
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getToken("refresh_token");
        if (!refreshToken) throw new Error("No refresh token stored");

        const { data } = await axios.post(`${API_BASE_URL}/users/refresh`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const newAccessToken = data.accessToken;
        await saveToken("access_token", newAccessToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await logoutUser();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// helper to set token for new logins
export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
