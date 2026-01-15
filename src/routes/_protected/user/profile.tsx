import UserProfilePage from '@/pages/users/UserProfilePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/user/profile')({
  component: UserProfilePage,
})

