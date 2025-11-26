import MonitoredServicesPage from '@/pages/services/MonitoredServicesPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/services/')({
  component: MonitoredServicesPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page) || 1,
      pageSize: Number(search.pageSize) || 10,
      sortBy: (search.sortBy as string) ?? '',
      name: (search.name as string) ?? '',
      url: (search.url as string) ?? '',
      region: (search.region as string) ?? '',
      interval: (search.interval as string) ?? '',
      active: (search.active as string) ?? '',
      ssl: (search.ssl as string) ?? '',
    };
  },
});
