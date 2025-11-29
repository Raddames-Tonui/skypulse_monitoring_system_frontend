import { Outlet, redirect } from '@tanstack/react-router';
import { useAuth } from '@/hooks/hooks';
import Loader from '@/components/Loader';
import UnauthorizedPage from '@/pages/auth/UnauthorizedPage';
import { hasRole } from '@/pages/auth/roles';

export function ProtectedRoute({ allowed }: { allowed: string[] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loader">
        <Loader size={80} speed={1.8} />
      </div>
    );
  }

  if (!user) {
    throw redirect({
      to: '/auth/login',
      search: { returnTo: window.location.pathname },
    });
  }

  if (!hasRole(user, allowed)) {
    return <UnauthorizedPage />;
  }

  return <Outlet />;
}