import type {ApiSingleResponse, UserProfile} from "@/context/data-access/types";
import axiosClient from "@/utils/constants/axiosClient";
import {useMutation, useQuery} from "@tanstack/react-query";
import type {ApiError, ApiResponse} from "@/utils/types.ts";
import type {CreateUserPayload, CreateUserResponse, Users} from "@/pages/users/data-access/types.ts";

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
export const useUsers = (params: Record<string, string | number | boolean>) => {
    return useQuery<ApiResponse<Users>, ApiError>({
        queryKey: ["users", params],
        queryFn: async () => {
            const {data} = await axiosClient.get<ApiResponse<Users>>("/users", {params});
            return data;
        },
    });
};

export function useCreateUser() {
    return useMutation<CreateUserResponse, any, CreateUserPayload>({
        mutationFn: async (payload) => {
            const res = await axiosClient.post("/users/user/create", payload);
            return res.data;
        },
    });
}