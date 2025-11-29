import axios from "axios";
import type { AxiosInstance } from "axios";
import { CONFIG } from "@/utils/constants/Constants";

const axiosClient: AxiosInstance = axios.create({
  baseURL: CONFIG.BASE_API_URL,
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({ code: "ERR_NETWORK", message: error.message });
    }

    const res = error.response;

    if (typeof res.data === "string") {
      try { res.data = JSON.parse(res.data); } catch { }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;