import RequestResetPassword from '@/pages/auth/RequestResetPassword'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/auth/request-password')({
  component: RequestResetPassword,
})
