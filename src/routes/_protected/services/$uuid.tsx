import SingleService from '@/pages/services/SingleService'
import { createFileRoute, redirect } from '@tanstack/react-router'

type ServiceSearch = {
  tab: 'overview' | 'incidents' | 'maintenance' | 'logs' | 'charts'
}

export const Route = createFileRoute('/_protected/services/$uuid')({
  component: SingleService,
  validateSearch: (search: Record<string, unknown>): ServiceSearch => {
    return {
      tab: (search.tab as ServiceSearch['tab']) || 'overview',
    }
  },
  beforeLoad: ({ search, params }) => {
    if (!search.tab) {
      throw redirect({
        to: Route.fullPath,
        params,
        search: { tab: 'overview' },
        replace: true,
      })
    }
  },
})
