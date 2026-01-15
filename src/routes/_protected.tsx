import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/hooks/hooks';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Loader from '@/components/Loader';
import axiosClient from '@/utils/constants/axiosClient';
import { useTheme } from '@/context/ThemeProvider';
import MobileSidebar from '@/components/MobileSidebar';
import "@css/layout.css";
// import Footer from '@/components/Footer';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    try {
      await axiosClient.get('/auth/profile');
      return null;
    } catch  {
      return redirect({
        to: '/auth/login',
        search: { returnTo: '/_protected/pages' },
      });
    }
  },
  component: ProtectedRouteComponent,
});

function ProtectedRouteComponent() {
  const { user, isLoading, fetchProfile } = useAuth();
  const { isSidebarOpen } = useTheme();

  useEffect(() => {
    if (!user && !isLoading) {
      fetchProfile().catch(() => {
      });
    }
  }, [user, isLoading, fetchProfile]);

  if (isLoading || !user?.roleName) {
    return (
      <div className='loader'>
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

      {/* <Footer /> */}
    </section>
  );
}