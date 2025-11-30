import ActivateUser from '@/pages/auth/ActivateUser'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/auth/set-password')({
  component: ActivateUser,
})

