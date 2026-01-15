import type { ApiSingleResponse, UserProfile } from "@/context/data-access/types";
import axiosClient from "@/utils/constants/axiosClient";
import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "./types";

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