import SSLLogsPage from '@/pages/reports/SSLLogsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/reports/ssl-reports')({
  component: SSLLogsPage,
})

