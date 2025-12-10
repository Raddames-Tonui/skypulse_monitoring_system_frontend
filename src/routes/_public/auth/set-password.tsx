import { createFileRoute } from '@tanstack/react-router'
import ActivateUser from '@/pages/auth/ActivateUser'


export const Route = createFileRoute('/_public/auth/set-password')({
  validateSearch: (search) => ({
    token: search.token as string | undefined,
  }),
  component: ActivateUser,
})

