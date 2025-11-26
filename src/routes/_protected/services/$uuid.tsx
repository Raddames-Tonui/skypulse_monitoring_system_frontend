import SingleService from '@/pages/services/SingleService'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/services/$uuid')({
  component: SingleService,
})

