import { createFileRoute } from '@tanstack/react-router'
import MonitoredServicesPage from '@/pages/services/MonitoredServicesPage'


export const Route = createFileRoute('/_protected/services/')({
  component:  MonitoredServicesPage,
})

