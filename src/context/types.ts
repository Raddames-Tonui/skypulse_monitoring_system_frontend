export interface UserContact {
  contactType: string;
  value: string;
  verified: boolean;
  isPrimary: boolean;
}

export interface UserPreferences {
  alertChannel: string;
  receiveWeeklyReports: boolean;
  language: string;
  timezone: string;
  dashboardLayout: Record<string, any>;
}

export interface UserProfile {
  uuid: string;
  fullName: string;
  email: string;
  roleName: string;
  roleId: number;
  companyName: string;
  userContacts: UserContact[];
  userPreferences: UserPreferences;
}

export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}
