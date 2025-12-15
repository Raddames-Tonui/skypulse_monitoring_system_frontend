import axiosClient from "@/utils/constants/axiosClient";
import type { ApiError, ApiSingleResponse, UserProfile } from "./types";
import { useQuery } from "@tanstack/react-query";

const PROFILE_QUERY_KEY = ["user-profile"];

const fetchUserProfile = async (): Promise<UserProfile> => {
    const response = await axiosClient.get<ApiSingleResponse<UserProfile>>(
        "/auth/profile"
    );

    return response.data.data;
};

export const useGetUserProfile = () => {
    return useQuery<UserProfile, ApiError>({
        queryKey: PROFILE_QUERY_KEY,
        queryFn: fetchUserProfile,
        staleTime: 5 * 60 * 1000,
    });
};