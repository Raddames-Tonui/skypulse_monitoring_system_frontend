import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/hooks/hooks';

import "@css/layout.css";
import "@css/Form.css";
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    return null;
  },
  component: ProtectedRouteComponent,
});

function ProtectedRouteComponent() {
  const { user, isLoading } = useAuth();  
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Redirect if user not logged in or role unauthorized
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        window.location.href = '/auth/login'; // simple redirect
        return;
      }

      const allowedRoles = ['admin', 'operator', 'viewer']; // your roles
      if (!allowedRoles.includes(user.roleName.toLowerCase())) {
        window.location.href = '/auth/unauthorized';
      }
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return <div>Loading...</div>; // or spinner
  }

  return (
    <div
      className="body-wrapper"
      style={{ '--sidebar-width': isSidebarOpen ? '240px' : '48px' } as React.CSSProperties}
    >
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Toaster position="top-right" />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
