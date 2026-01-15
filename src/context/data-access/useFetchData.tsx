import type { ApiError, ApiSingleResponse, UserProfile } from "@/context/data-access/types";
import axiosClient from "@/utils/constants/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { PROFILE_QUERY_KEY } from "@/context/data-access//useMutateData";


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