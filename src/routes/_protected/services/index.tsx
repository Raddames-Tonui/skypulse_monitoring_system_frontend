import MonitoredServicesPage from '@/pages/services/MonitoredServicesPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/services/')({
  component: MonitoredServicesPage,
});
