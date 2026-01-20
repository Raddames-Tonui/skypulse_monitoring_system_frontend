import {type ReactNode, useContext} from "react";
import {AuthContext} from "@/context/AuthContext.tsx";

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
    type: 'EMAIL' | 'PHONE' | 'SMS' | 'TELEGRAM';
    is_primary: boolean;
    verified: boolean;
    value: string;
}

// ----------- USER PREFERENCES -----------
export interface UserPreferences {
  alert_channel: "EMAIL" | "SMS" | "TELEGRAM" | 'PHONE';
  receive_weekly_reports: boolean;
  timezone: string;
  dashboard_layout: {
      type: string;
      value: string;
      null: boolean;
  };
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
    company_name: string | undefined;
    is_active: boolean;
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
  fetchProfile: () => Promise<UserProfile> | null; 
}

export interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};