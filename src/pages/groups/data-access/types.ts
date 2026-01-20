export interface ContactGroupMember {
    user_id: number;
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface ContactGroupContact {
    contact_group_contact_id: number;
    type: 'EMAIL' | 'PHONE' | 'SMS' | 'TELEGRAM' | 'SLACK' | 'TEAMS';
    value: string;
    verified: boolean;
    is_primary: boolean;
}

export interface ContactGroupData {
    contact_group_id: number;
    uuid: string;
    contact_group_name: string;
    contact_group_description: string;
    primary_member: string | null;
    members: ContactGroupMember[];
    contacts: ContactGroupContact[];
}

export interface ApiSingleResponse {
    data: ContactGroupData;
    message: string;
}

export type ApiError = {
    message: string;
    status?: string;
}


// GROUP'S SERVICES
export interface ContactGroupService {
    monitored_service_id: number;
    uuid: string;
    monitored_service_name: string;
    monitored_service_url: string;
    last_uptime_status: "UP" | "DOWN" | string;
    is_active: boolean;
}

export interface ContactGroupServicesData {
    group_uuid: string;
    services: ContactGroupService[];
}

export interface ApiContactGroupServicesResponse {
    data: ContactGroupServicesData;
    message: string;
}
