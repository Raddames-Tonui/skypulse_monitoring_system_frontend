import { ProtectedRoute } from '@/pages/auth/ProtectedRoute';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_operator')({
  component: () => <ProtectedRoute allowed={['OPERATOR']} />,
});