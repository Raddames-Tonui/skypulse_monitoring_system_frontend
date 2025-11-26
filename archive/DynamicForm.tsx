import axios from "axios";
import { CONFIG } from "@/utils/constants/Constants";

const axiosClient = axios.create({
  baseURL: CONFIG.BASE_API_URL,
  withCredentials: true, // ensures cookies are sent
});

// --- Response interceptor ---
axiosClient.interceptors.response.use(
  (response) => response.data, // return only data by default
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject({ code: "ERR_NETWORK", message: error.message });
    }

    // Handle 401 / 403 globally
    if (error.response.status === 401) {
      console.warn("Unauthorized request");
      // optional: redirect to login or clear auth context
    }

    return Promise.reject(error.response.data || error);
  }
);

export default axiosClient;
