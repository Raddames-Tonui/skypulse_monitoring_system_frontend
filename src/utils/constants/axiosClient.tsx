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
    return Promise.reject(error.response);
  }
);

export default axiosClient;
