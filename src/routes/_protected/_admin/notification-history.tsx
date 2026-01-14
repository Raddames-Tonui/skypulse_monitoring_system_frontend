import NotificationHistoryPage from '@/pages/logs/NotificationHistoryPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_admin/notification-history')(
  {
    component: NotificationHistoryPage,
  },
)

