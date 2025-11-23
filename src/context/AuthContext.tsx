import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, UserProfile } from "./types";
import axiosClient from "@/utils/constants/axiosClient";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProfile().finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post("/auth/login", { email, password });
      const userData = response.data?.data?.user;

      if (!userData) throw new Error("Login failed: No user returned");

      setUser({
        uuid: userData.uuid,
        fullName: userData.fullName,
        email: userData.email,
        roleName: userData.role,
        roleId: 0, 
        companyName: "",
        userContacts: [],
        userPreferences: {
          alertChannel: "email",
          receiveWeeklyReports: false,
          language: "en",
          timezone: "UTC",
          dashboardLayout: {},
        },
      });

      await fetchProfile();
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get("/auth/profile");
      const profile = response.data?.data;
      if (!profile) throw new Error("Profile not found");

      const mappedProfile: UserProfile = {
        uuid: profile.uuid,
        fullName: profile.full_name,
        email: profile.email,
        roleName: profile.role_name,
        roleId: profile.role_id,
        companyName: profile.company_name,
        userContacts: profile.user_contacts.map((c: any) => ({
          contactType: c.contact_type,
          value: c.value,
          verified: c.verified,
          isPrimary: c.is_primary,
        })),
        userPreferences: {
          alertChannel: profile.user_preferences.alert_channel,
          receiveWeeklyReports: profile.user_preferences.receive_weekly_reports,
          language: profile.user_preferences.language,
          timezone: profile.user_preferences.timezone,
          dashboardLayout: profile.user_preferences.dashboard_layout?.value
            ? JSON.parse(profile.user_preferences.dashboard_layout.value)
            : {},
        },
      };

      setUser(mappedProfile);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await axiosClient.post("/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
