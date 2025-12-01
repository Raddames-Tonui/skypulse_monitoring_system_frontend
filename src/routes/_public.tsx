import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';

export const Route = createFileRoute('/_public')({
  component: PublicRouteComponent,
});

function PublicRouteComponent() {
  return (
    <>
        <Toaster position="top-center" />
        <Outlet />
    </>
  );
}
