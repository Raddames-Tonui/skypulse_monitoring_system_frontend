import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import toast from "react-hot-toast";
import type { ApiError, ApiSingleResponse, UserProfile } from "./types";

const PROFILE_QUERY_KEY = ["user-profile"];

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation<UserProfile, ApiError, { email: string; password: string }>({
        mutationFn: async (credentials) => {
            const response = await axiosClient.post<ApiSingleResponse<UserProfile>>("/auth/login", credentials);
            return response.data.data;
        },
        onSuccess: (data) => {
            toast.success("Login successful");
            queryClient.setQueryData(PROFILE_QUERY_KEY, data);
        },
        onError: (err: ApiError) => {
            toast.error(err.message || "Login failed");
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError>({
        mutationFn: async () => {
            await axiosClient.post("/auth/logout");
        },
        onSuccess: () => {
            toast.success("Logged out successfully");
            queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
        },
        onError: (err: ApiError) => {
            toast.error(err.message || "Logout failed");
        },
    });
};

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<UserProfile, ApiError, Partial<UserProfile>, { previousData?: UserProfile }>({
        mutationFn: async (updatedUser) => {
            const response = await axiosClient.put<ApiSingleResponse<UserProfile>>("/auth/profile", updatedUser);
            return response.data.data;
        },

        onMutate: async (updatedUser) => {
            await queryClient.cancelQueries({ queryKey: PROFILE_QUERY_KEY });
            const previousData = queryClient.getQueryData<UserProfile>(PROFILE_QUERY_KEY);

            queryClient.setQueryData<UserProfile>(PROFILE_QUERY_KEY, (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    ...updatedUser,
                    user_preferences: {
                        ...oldData.user_preferences,
                        ...updatedUser.user_preferences,
                    },
                };
            });

            return { previousData };
        },

        onError: (_err, _updatedUser, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(PROFILE_QUERY_KEY, context.previousData);
            }
            toast.error("Failed to update profile");
        },

        onSuccess: (data) => {
            toast.success("Profile updated successfully");
            queryClient.setQueryData(PROFILE_QUERY_KEY, data);
        },
    });
};
