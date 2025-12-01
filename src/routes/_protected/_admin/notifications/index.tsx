import Notifications from '@/pages/notifications/Notifications'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_admin/notifications/')({
  component: Notifications,
})

