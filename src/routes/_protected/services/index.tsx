import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import MonitoredServicesPage from '@/pages/services/MonitoredServicesPage';

const servicesSearchSchema = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(10),
  sort: z.string().optional().catch(''),
  monitored_service_id: z.string().optional(),
  monitored_service_name: z.string().optional(),
  ssl_enabled: z.string().optional(),
  last_uptime_status: z.string().optional(),
});

export type ServicesSearch = z.infer<typeof servicesSearchSchema>;

export const Route = createFileRoute('/_protected/services/')({
  validateSearch: (search) => servicesSearchSchema.parse(search),
  component: MonitoredServicesPage,
});