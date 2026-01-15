// ---------------- _protected.tsx ----------------
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useTheme } from '@/context/ThemeProvider';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/MobileSidebar';
import { Toaster } from 'react-hot-toast';
import "@css/layout.css";

const allowedRoles = ["ADMIN", "VIEWER", "OPERATOR"];

// Utility: safely get user from localStorage
const getUserFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem("userProfile");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    const user = getUserFromLocalStorage();

    // Redirect if no user or inactive
    if (!user ) {
      throw redirect({
        to: '/auth/login',
        search: { returnTo: '/_protected/pages' },
      });
    }

    // Redirect if user role is not allowed
    if (!allowedRoles.includes(user.role_name)) {
      throw redirect({ to: '/auth/unauthorized' });
    }

    return { user };
  },
  component: ProtectedRouteComponent,
});

function ProtectedRouteComponent() {
  const { isSidebarOpen } = useTheme();

  // Always get user from localStorage
  const user = getUserFromLocalStorage();

  // Show loader while checking
  if (!user) {
    return (
      <div className="loader">
        <Loader size={80} speed={1.8} className="mx-auto" ariaLabel="Loading..." />
      </div>
    );
  }

  return (
    <section
      className="body-wrapper"
      style={{ '--sidebar-width': isSidebarOpen ? '240px' : '48px' } as React.CSSProperties}
    >
      <Navbar />
      <Toaster position="top-right" />
      <Sidebar />
      <main>
        <Outlet />
      </main>
      <MobileSidebar />
    </section>
  );
}
