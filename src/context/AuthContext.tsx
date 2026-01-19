import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AuthContextType, AuthProviderProps, UserProfile } from "@/context/data-access/types";
import { useLogin, useLogout } from "@/context/data-access/useMutateData";
import { useGetUserProfile } from "@/pages/users/data-access/useFetchData";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const { data: profileData, refetch: refetchProfile, isFetching } = useGetUserProfile();

  const fetchProfile = useCallback(async (): Promise<UserProfile> => {
    const result = await refetchProfile();
    if (!result.data) throw new Error("Failed to fetch profile");
    return result.data;
  }, [refetchProfile]);

  useEffect(() => {
    let isMounted = true;

    const hydrateUser = async () => {
      try {
        if (profileData && isMounted) {
          setUser(profileData);
          localStorage.setItem("userProfile", JSON.stringify(profileData));
          return;
        }

        const stored = localStorage.getItem("userProfile");
        if (stored && isMounted) {
          setUser(JSON.parse(stored));
        }

        const freshProfile = await fetchProfile();
        if (freshProfile && isMounted) {
          setUser(freshProfile);
          localStorage.setItem("userProfile", JSON.stringify(freshProfile));
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load user");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    hydrateUser();
    return () => { isMounted = false; };
  }, [profileData, fetchProfile]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await loginMutation.mutateAsync({ email, password });

        const profile = await fetchProfile();
        setUser(profile);
        localStorage.setItem("userProfile", JSON.stringify(profile));
      } catch (err: any) {
        setError(err?.message || "Login failed");
        throw err;
      }
    },
    [loginMutation, fetchProfile]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      setUser(null);
      localStorage.removeItem("userProfile");
    } catch (err: any) {
      setError(err?.message || "Logout failed");
      throw err;
    }
  }, [logoutMutation]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isLoading || isFetching,
        error,
        login,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
