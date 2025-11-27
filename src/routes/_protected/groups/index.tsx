import ContactGroupsPage from '@/pages/groups/ContactGroupsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/groups/')({
  component: ContactGroupsPage,
})

