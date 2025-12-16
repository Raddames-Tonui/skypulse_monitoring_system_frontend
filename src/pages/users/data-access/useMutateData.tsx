import axiosClient from "@/utils/constants/axiosClient";
import type { ApiError, UserProfile } from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiSingleResponse } from "@/context/data-access/types";
import toast from "react-hot-toast";

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<
        UserProfile,
        ApiError,
        Partial<UserProfile>,
        { previousData?: UserProfile }
    >({
        mutationFn: async (updatedUser) => {
            const response = await axiosClient.put<ApiSingleResponse<UserProfile>>(
                "/auth/profile",
                updatedUser
            );
            return response.data.data;
        },

        // Step 1: Optimistically update cache
        onMutate: async (updatedUser) => {
            // Cancel any ongoing fetches for this user profile
            await queryClient.cancelQueries({ queryKey: ["user-profile"] });

            // Snapshot previous data
            const previousData =
                queryClient.getQueryData<UserProfile>(["user-profile"]);

            // Update cache optimistically
            queryClient.setQueryData<UserProfile>(["user-profile"], (oldData) => {
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

            // Return snapshot for rollback
            return { previousData };
        },

        // Step 2: Rollback on error
        onError: (_err, _updatedUser, context) => {
            if (context?.previousData) {
                queryClient.setQueryData<UserProfile>(
                    ["user-profile"],
                    context.previousData
                );
            }

            toast.error("Failed to update profile");
        },

        // Step 3: Sync cache on success
        onSuccess: (data) => {
            toast.success("Profile updated successfully");
            queryClient.setQueryData<UserProfile>(["user-profile"], data);
        },

        // Step 4: Invalidate dependent queries to ensure UI consistency
        // onSettled: () => {
        //   queryClient.invalidateQueries({ queryKey: ["dashboard", "settings"] });
        // },
    });
};
