import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import toast from "react-hot-toast";
import type { ApiError } from "@/pages/groups/data-access/types";
import {
    CONTACT_GROUP_QUERY_KEY,
    CONTACT_GROUP_SERVICES_QUERY_KEY,
} from "@/pages/groups/data-access/useFetchData.tsx";

// Remove a group member
export const useRemoveGroupMember = (groupUuid: string) => {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number>({
        mutationFn: async (userId: number) => {
            await axiosClient.delete(`/contacts/groups/${groupUuid}/members`, {
                data: { user_id: userId },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACT_GROUP_QUERY_KEY(groupUuid) });
        },
        onError: (err: any) => {
            const msg = err?.response?.data?.message || err.message || "Failed to remove member";
            toast.error(msg);
        },
    });
};

// Set primary member
export const useSetPrimaryMember = (groupUuid: string) => {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number>({
        mutationFn: async (primaryUserId: number) => {
            await axiosClient.put(`/contacts/groups/${groupUuid}/primary`, { primaryUserId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACT_GROUP_QUERY_KEY(groupUuid) });
        },
        onError: (err: any) => {
            const msg = err?.response?.data?.message || err.message || "Failed to set primary member";
            toast.error(msg);
        },
    });
};

// Add services to group
export const useAddGroupServices = (groupUuid: string) => {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number[]>({
        mutationFn: async (serviceIds: number[]) => {
            await axiosClient.post(`/contacts/groups/${groupUuid}/services`, { serviceIds });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACT_GROUP_SERVICES_QUERY_KEY(groupUuid) });
            toast.success("Services added successfully");
        },
        onError: (err: any) => {
            const msg = err?.response?.data?.message || err.message || "Failed to add services";
            toast.error(msg);
        },
    });
};

// Remove service from group
export const useRemoveGroupService = (groupUuid: string) => {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number>({
        mutationFn: async (serviceId: number) => {
            await axiosClient.delete(`/contacts/groups/${groupUuid}/services`, {
                data: { service_id: serviceId },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACT_GROUP_SERVICES_QUERY_KEY(groupUuid) });
        },
        onError: (err: any) => {
            const msg = err?.response?.data?.message || err.message || "Failed to remove service";
            toast.error(msg);
        },
    });
};
