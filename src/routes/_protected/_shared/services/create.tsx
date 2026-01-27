import CreateService from '@/pages/services/components/CreateService.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_shared/services/create')({
  component: CreateService,
})

