import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import ContactGroupsPage from '@/pages/groups/ContactGroupsPage';

const groupSearchSchema = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(20),
  sort: z.string().optional(),
  contact_group_name: z.string().optional(),
  is_deleted: z.string().optional(),
});

export const Route = createFileRoute('/_protected/_admin/groups/')({
  validateSearch: groupSearchSchema,
  component: ContactGroupsPage,
});
