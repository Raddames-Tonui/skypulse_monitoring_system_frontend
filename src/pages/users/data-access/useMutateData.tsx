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

        onMutate: async (updatedUser) => {
            await queryClient.cancelQueries({ queryKey: ["user-profile"] });

            const previousData =
                queryClient.getQueryData<UserProfile>(["user-profile"]);

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

            return { previousData };
        },

        onError: (_err, _updatedUser, context) => {
            if (context?.previousData) {
                queryClient.setQueryData<UserProfile>(
                    ["user-profile"],
                    context.previousData
                );
            }

            toast.error("Failed to update profile");
        },

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
