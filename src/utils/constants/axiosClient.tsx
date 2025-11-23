import axios from "axios";
import { CONFIG } from "@/utils/constants/Constants";

const axiosClient = axios.create({
  baseURL: CONFIG.BASE_API_URL,
  withCredentials: true, // ensures cookies are sent
});

export default axiosClient;
