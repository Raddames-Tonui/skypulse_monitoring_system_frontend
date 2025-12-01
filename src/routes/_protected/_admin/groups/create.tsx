import CreateContactGroupPage from '@/pages/groups/CreateContactGroupPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_admin/groups/create')({
  component: CreateContactGroupPage,
})

