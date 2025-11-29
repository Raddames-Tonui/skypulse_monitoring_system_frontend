import SystemSettings from '@/pages/SystemSettings';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_admin/settings/')({
  component: SystemSettings,
})

