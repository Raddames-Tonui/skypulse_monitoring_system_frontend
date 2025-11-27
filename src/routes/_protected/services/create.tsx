import CreateService from '@/pages/services/CreateService'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/services/create')({
  component: CreateService,
})

