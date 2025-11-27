import GetUsersPage from '@/pages/users/GetUsersPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/users/')({
  component: GetUsersPage,
})

