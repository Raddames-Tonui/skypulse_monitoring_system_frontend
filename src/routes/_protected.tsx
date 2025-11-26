import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/hooks/hooks';

import "@css/layout.css";
import "@css/Form.css";
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => null,
  component: ProtectedRouteComponent,
});

function ProtectedRouteComponent() {
  const { user, isLoading, error } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      throw redirect({
        to: '/auth/login',
        search: { returnTo: '/_protected/pages' },
      });
    }

    if (error) {
      throw redirect({
        to: '/auth/login',
        search: { returnTo: location.pathname },
      });
    }

    const roleName = user.roleName?.toUpperCase(); 
    const allowedRoles = ['ADMIN', 'OPERATOR', 'VIEWER'];
    if (!roleName || !allowedRoles.includes(roleName)) {
      throw redirect({ to: '/auth/unauthorized' });
    }
  }, [user, isLoading, error]);

  if (isLoading || !user) {
    return (
      <div className='loader'>
        <Loader size={80} speed={1.8} className="mx-auto" ariaLabel="Loading..." />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <section
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
    </section>
  );
}
