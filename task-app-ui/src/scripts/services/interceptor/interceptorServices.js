import axios from "axios";
import { apiUrl } from "../../../env/environment";

const getAccessToken = () => {
  return sessionStorage.getItem("access_token");
};

const apiClient = axios.create({
  baseURL: apiUrl,
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

export default apiClient;
