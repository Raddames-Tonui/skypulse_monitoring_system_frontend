import CreateUser from '@/pages/users/CreateUser'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_admin/users/create-user')({
  component: CreateUser,
})

