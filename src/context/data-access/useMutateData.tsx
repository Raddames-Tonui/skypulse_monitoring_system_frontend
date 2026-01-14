import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import toast from "react-hot-toast";
import type { UserProfile, ApiError, ApiSingleResponse } from "./types";
import { PROFILE_QUERY_KEY } from "./useFetchData";

// -------- LOGIN --------
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, ApiError, { email: string; password: string }>({
    mutationFn: async (credentials) => {
      const { data } = await axiosClient.post<ApiSingleResponse<UserProfile>>(
        "/auth/login",
        credentials
      );
      return data.data;
    },
    onSuccess: (data) => {
      toast.success("Login successful");
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err.message || "Login failed";
      toast.error(msg);
    },
  });
};

// -------- LOGOUT --------
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
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err.message || "Logout failed";
      toast.error(msg);
    },
  });
};

// -------- UPDATE PROFILE --------
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, ApiError, Partial<UserProfile>, { previousData?: UserProfile }>({
    mutationFn: async (updatedUser) => {
      const { data } = await axiosClient.put<ApiSingleResponse<UserProfile>>(
        "/auth/profile",
        updatedUser
      );
      return data.data;
    },
    onMutate: async (updatedUser) => {
      await queryClient.cancelQueries({ queryKey: PROFILE_QUERY_KEY });
      const previousData = queryClient.getQueryData<UserProfile>(PROFILE_QUERY_KEY);

      queryClient.setQueryData<UserProfile>(PROFILE_QUERY_KEY, (old) => {
        if (!old) return old;
        return { ...old, ...updatedUser };
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
