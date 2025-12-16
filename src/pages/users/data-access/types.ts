
// ----------- GENERIC API RESPONSE  -----------
export type ApiSingleResponse<T> = {
    data: T;
    message: string;
}


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
    role_name: string;
    company_name: string;
    user_contacts: UserContact[];
    user_preferences:  UserPreferences;
}