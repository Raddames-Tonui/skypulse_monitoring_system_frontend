import { createContext, useContext, useState, useCallback} from "react";
import type { AuthContextType, AuthProviderProps, UserProfile } from "./data-access/types";
import { useLogout } from "@/context/data-access/useMutateData";

const USER_KEY = "userProfile";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const logoutMutation = useLogout();

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      setUser(null);
    }
  }, [logoutMutation]);

  const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      const profile = stored ? JSON.parse(stored) : null;
      setUser(profile);
      return profile;
    } catch {
      setUser(null);
      return null;
    }
  }, []);



  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: false,
        error: null,       
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
