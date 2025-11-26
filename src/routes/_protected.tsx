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
  beforeLoad: async () => {
    return null;
  },
  component: ProtectedRouteComponent,
});

function ProtectedRouteComponent() {
  const { user, isLoading, error, fetchProfile } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    if (!isLoading) {
      if (!user || error) {
        return;
      }
      if (!user) {
        throw redirect({
          to: '/auth/login',
          search: { returnTo: '/_protected/pages' }
        });
      }

      const allowedRoles = ['ADMIN', 'OPERATOR', 'VIEWER'];
      if (!allowedRoles.includes(user.roleName.toUpperCase())) {
        throw redirect({
          to: '/auth/unauthorized'
        });
      }
    }
  }, [user, isLoading, error]);

  if (error && !isLoading) {
    return (
      <div className='server-error' >
        <h1>Server Error</h1>
        <p>{error}</p>
        <button onClick={() => fetchProfile()}>Retry</button>
      </div>
    );
  }

  if (isLoading || !user) {
    return <div className='loader'>
      <Loader size={80} speed={1.8} className="mx-auto" ariaLabel="Loading..." />
      <p>Loading...</p>
    </div>;
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
