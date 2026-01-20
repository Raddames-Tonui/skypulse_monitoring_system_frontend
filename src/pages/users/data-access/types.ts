
// ----------- GENERIC API RESPONSE  -----------

export type ApiError = {
    message: string;
    status: string;
}


// ----------- USER CONTACT -----------
export interface UserContact {
    contact_type: 'EMAIL' | 'PHONE' | 'SMS' | 'TELEGRAM';
    is_primary: boolean;
    verified: boolean;
    value: string;
}

// ----------- USER PREFERENCES -----------
export interface UserPreferences {
  alert_channel: "EMAIL" | "SMS" | "TELEGRAM" | 'PHONE' ;
  receive_weekly_reports: boolean;
  timezone: string;
  dashboard_layout?: Record<string, unknown>;
  language: string;
}

// ----------- USER PROFILE -----------
export interface UserProfile {
    uuid: string;
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    role_name: 'ADMIN' | 'OPERATOR' | 'VIEWER'; 
    company_name: string;
    user_contacts: UserContact[];
    user_preferences:  UserPreferences;
} // ----------CREATE USER -----------
// ---- users -------
export type Users = {
    uuid: string;
    user_id: number;
    first_name: string;
    last_name: string;
    user_email: string;
    role_id: number;
    role_name: string;
    company_id: number;
    company_name: string;
    is_active: boolean;
    date_created: string;
    date_modified: string;
};

// ----------- USERS -----------
export interface User {
    id: number;
    uuid: string;
    first_name: string;
    last_name: string;
    user_email: string;
    role_name: string;
    company_name: string;
    is_active: boolean;
    date_created: string;
    date_modified: string;
}

export interface CreateUserPayload {
    first_name: string;
    last_name: string;
    user_email: string;
    role_name: string;
    company_id: number;
}

export interface CreateUserSuccessResponse {
    data: {
        userCreationStatus: "QUEUED";
        userId: number;
        uuid: string;
        emailStatus: "QUEUED";
        tokenGenerationStatus: "QUEUED";
    };
    message: string;
    status: "success";
}

export interface CreateUserErrorResponse {
    message: string;
    status: "error";
}

export type CreateUserResponse =
    | CreateUserSuccessResponse
    | CreateUserErrorResponse;

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}