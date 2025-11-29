import { ProtectedRoute } from '@/pages/auth/ProtectedRoute';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_manage')({
  component: () => <ProtectedRoute allowed={['ADMIN', 'OPERATOR']} />,
});