import axiosClient from "@/utils/constants/axiosClient";
import { useQuery } from "@tanstack/react-query";
import type {
    ContactGroupData,
    ApiError,
    ApiSingleResponse,
    ContactGroupServicesData, ApiContactGroupServicesResponse
} from "@/pages/groups/data-access/types";

export const CONTACT_GROUP_QUERY_KEY = (uuid: string) => ["contact-group", uuid];

const fetchContactGroup = async (uuid: string): Promise<ContactGroupData> => {
    const response = await axiosClient.get<ApiSingleResponse>(`/contacts/group?uuid=${uuid}`);
    return response.data.data;
};

export const useGetContactGroup = (uuid: string) => {
    return useQuery<ContactGroupData, ApiError>({
        queryKey: CONTACT_GROUP_QUERY_KEY(uuid),
        queryFn: () => fetchContactGroup(uuid),
        staleTime: 5 * 60 * 1000,
        enabled: Boolean(uuid),
    });
};


export const CONTACT_GROUP_SERVICES_QUERY_KEY = (uuid: string) => ["contact-group-services", uuid];

const fetchContactGroupServices = async (uuid: string): Promise<ContactGroupServicesData> => {
    const response = await axiosClient.get<ApiContactGroupServicesResponse>(
        `/contacts/groups/${uuid}/services`
    );
    return response.data.data;
};

export const useGetContactGroupServices = (uuid: string) => {
    return useQuery<ContactGroupServicesData, Error>({
        queryKey: CONTACT_GROUP_SERVICES_QUERY_KEY(uuid),
        queryFn: () => fetchContactGroupServices(uuid),
        staleTime: 5 * 60 * 1000,
        enabled: Boolean(uuid),
    });
};