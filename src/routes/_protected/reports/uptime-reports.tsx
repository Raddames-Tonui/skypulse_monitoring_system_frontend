import UptimeLogsPage from '@/pages/reports/UptimeLogsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/reports/uptime-reports')({
  component: UptimeLogsPage,
})

