import EditTemplatePage from '@/pages/templates/EditTemplatePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_admin/templates/$uuid')({
  component: EditTemplatePage,
})
