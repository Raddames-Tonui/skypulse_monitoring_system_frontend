import { ProtectedRoute } from '@/pages/auth/ProtectedRoute';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_shared')({
  component: () => <ProtectedRoute allowed={['ADMIN','OPERATOR' ]} />,
});