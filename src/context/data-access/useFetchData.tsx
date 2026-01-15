// import { useQuery } from "@tanstack/react-query";
// import axiosClient from "@/utils/constants/axiosClient";
// import type { ApiError, ApiSingleResponse, UserProfile } from "./types";
// import { useEffect } from "react";
// import toast from "react-hot-toast";

// export const PROFILE_QUERY_KEY = ["user-profile"];

// const fetchUserProfile = async (): Promise<UserProfile> => {
//   const response = await axiosClient.get<ApiSingleResponse<UserProfile>>("/auth/profile");
//   return response.data.data;
// };

// export const useGetUserProfile = (enabled = true) => {
//   const query = useQuery<UserProfile, ApiError>({
//     queryKey: PROFILE_QUERY_KEY,
//     queryFn: fetchUserProfile,
//     staleTime: 5 * 60 * 1000,
//     retry: false,
//     enabled, 
//   });

//   useEffect(() => {
//     if (query.isSuccess && query.data) {
//       localStorage.setItem("userProfile", JSON.stringify(query.data));
//     }
//     if (query.isError) {
//       toast.error(query.error?.message || "Failed to fetch user profile");
//     }
//   }, [query.isSuccess, query.isError, query.data, query.error]);

//   return query;
// };
