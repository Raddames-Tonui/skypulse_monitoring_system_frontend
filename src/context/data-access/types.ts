import type { ReactNode } from "react";

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
  alert_channel: "EMAIL" | "SMS" | "TELEGRAM" | 'PHONE';
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
    user_preferences: UserPreferences;
}

// ----------- AUTH CONTEXT -----------
export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>; 
}

export interface AuthProviderProps {
  children: ReactNode;
}
