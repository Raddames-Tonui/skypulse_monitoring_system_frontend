import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import toast from "react-hot-toast";
import type { UserProfile, ApiError, ApiSingleResponse } from "@/context/data-access/types";
import { useNavigate } from "@tanstack/react-router";


export const PROFILE_QUERY_KEY = ["user-profile"];



export const useLogin = () => {
  const queryClient = useQueryClient();

  // -------- LOG IN--------
  return useMutation<UserProfile, ApiError, { email: string; password: string }>({
    mutationFn: async (credentials) => {
      const response = await axiosClient.post<ApiSingleResponse<UserProfile>>(
        "/auth/login",
        credentials
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
      localStorage.setItem("userProfile", JSON.stringify(data));
    }    
  });
};



// -------- LOGOUT --------
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<void, ApiError>({
    mutationFn: async () => {
      await axiosClient.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
      localStorage.removeItem("userProfile");
      sessionStorage.removeItem("isSidebarOpen");
      navigate({ to: "/auth/login" });
      toast.success("Logged out successfully");
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

      localStorage.setItem("userProfile", JSON.stringify(data));

      // Optional: Invalidate dependent queries if they rely on updated profile
      // queryClient.invalidateQueries({ queryKey: ["dashboard", "settings"] });
    },
  });
};

