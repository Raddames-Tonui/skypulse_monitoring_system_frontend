import Register from '@/pages/auth/Register'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/auth/register')({
  component: Register,
})

