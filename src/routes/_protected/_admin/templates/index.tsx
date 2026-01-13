import NotificationTemplatesPage from '@/pages/templates/NotificationTemplatesPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_admin/templates/')({
  component: NotificationTemplatesPage,
})

