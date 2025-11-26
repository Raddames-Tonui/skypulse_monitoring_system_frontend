import UptimeLogsPage from '@/pages/logs/UptimeLogsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/services/logs')({
  component: UptimeLogsPage,
})
