import { AuthContext } from "@/context/AuthContext";
import type { AuthContextType } from "@/context/types";
import { useContext } from "react";
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/constants/axiosClient';
import type { ApiResponse, ApiError, User } from '@/context/types';

export const useUsers = (params: Record<string, string | number>) => {
  return useQuery<ApiResponse<User>, ApiError>({
    queryKey: ['users', params],
    queryFn: async () => {
      const { data } = await axiosClient.get('/users', { params });
      return data;
    },
  });
};



export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
