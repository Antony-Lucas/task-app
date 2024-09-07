import axios from "axios";
import { apiUrl } from "../../../env/environment";

const getAccessToken = () => {
  return sessionStorage.getItem("access_token");
};

const getRefreshToken = () => {
  return sessionStorage.getItem("refresh_token");
};

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = getRefreshToken();
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      console.log(`refresh_token: ${refreshToken}`);

      try {
        const { data } = await apiClient.post("auth/refresh_token", {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = data;
        addTokenToSessionStorage(access_token, refresh_token);

        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (err) {
        console.error("Failed to refresh token:", err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

const addTokenToSessionStorage = (accessToken, refreshToken) => {
  if (accessToken && refreshToken) {
    sessionStorage.setItem("access_token", accessToken);
    sessionStorage.setItem("refresh_token", refreshToken);
  } else {
    console.error("Access token or refresh token is undefined or null");
  }
};

export default apiClient;
