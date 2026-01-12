import TemplatesPage from '@/pages/templates/TemplatesPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_admin/templates/')({
  component: TemplatesPage,
})

