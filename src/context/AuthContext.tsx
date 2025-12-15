import React, { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, UserProfile } from "@/context/data-access/types";
import axiosClient from "@/utils/constants/axiosClient";
import { toast } from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    const initProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchProfile();
      } catch (err: any) {
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

      if (!userData) throw new Error(response.data?.message || "Login failed");

      setUser(mapProfile(userData));
      navigate("/"); // redirect after login
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

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get("/auth/profile");
      const profile = response.data?.data;

      // If profile missing or no role, force logout
      if (!profile || !profile.role_name) {
        await logout();
        return;
      }

      setUser(mapProfile(profile));
      setError(null);
    } catch (err: any) {
      setUser(null);
      setError(err.response?.data?.message || err.message || "Failed to fetch profile");
      navigate("/login"); // redirect if fetch fails
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await axiosClient.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Logout failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
      navigate("/login"); // always redirect after logout
    }
  }, [navigate]);

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
