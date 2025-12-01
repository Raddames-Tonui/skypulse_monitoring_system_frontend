import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, UserProfile } from "./types";
import axiosClient from "@/utils/constants/axiosClient";
import { toast } from "react-hot-toast";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  console.log(user?.fullName);

  useEffect(() => {
    const initProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchProfile();
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        setError(err.response?.data?.message || err.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    initProfile();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosClient.post("/auth/login", { email, password });
      const userData = response.data?.data?.user;

      if (!userData) {
        throw new Error(response.data?.message || "Login failed");
      }

      setUser(mapProfile(userData));
    } catch (err: any) {
      setUser(null);
      const msg = err.response?.data?.message || err.message || "Login failed";
      setError(msg);
      toast.error(msg);
      throw err; 
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get("/auth/profile");
      const profile = response.data?.data;

      if (!profile) throw new Error(response.data?.message || "Profile not found");

      setUser(mapProfile(profile));
      setError(null);
    } catch (err: any) {
      setUser(null);
      setError(err.response?.data?.message || err.message || "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosClient.post("/auth/logout");
      setUser(null);
      toast.success(response.data?.message || "Logged out successfully");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Logout failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, fetchProfile, error }}>
      {children}
    </AuthContext.Provider>
  );
};

function mapProfile(userData: any): UserProfile {
  return {
    uuid: userData.uuid,
    fullName: userData.full_name,
    email: userData.email,
    roleName: userData.role_name,
    companyName: userData?.company_name || undefined,
    userContacts: userData.user_contacts || [],
    userPreferences: {
      alertChannel: userData.user_preferences?.alert_channel,
      receiveWeeklyReports: userData.user_preferences?.receive_weekly_reports,
      language: userData.user_preferences?.language,
      timezone: userData.user_preferences?.timezone,
      dashboardLayout: userData.user_preferences?.dashboard_layout?.value
        ? JSON.parse(userData.user_preferences.dashboard_layout.value)
        : {},
    },
  };
}