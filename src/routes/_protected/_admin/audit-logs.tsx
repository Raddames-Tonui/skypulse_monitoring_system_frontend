import AuditLogsPage from '@/pages/logs/AuditLogsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_admin/audit-logs')({
  component: AuditLogsPage,
})

