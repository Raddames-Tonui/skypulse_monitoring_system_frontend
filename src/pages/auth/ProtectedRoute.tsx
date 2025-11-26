import { useAuth } from "@/hooks/hooks";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

interface ProtectedProps {
  requiredRole?: string;
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedProps> = ({ requiredRole, children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate({ to: "/auth/login" });
      return;
    }

    if (requiredRole && user.roleName !== requiredRole) {
      navigate({ to: "/auth/unauthorized" });
    }
  }, [user, requiredRole, navigate]);

  if (!user || (requiredRole && user.roleName !== requiredRole)) return null;

  return children;
};
