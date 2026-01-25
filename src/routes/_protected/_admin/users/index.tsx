import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import GetUsersPage from '@/pages/users/GetUsersPage';

const userSearchSchema = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(20),
  sort: z.string().optional().catch(''),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  user_email: z.string().optional(),
  role_name: z.string().optional(),
  company_name: z.string().optional(),
  is_active: z.string().optional(),
});

export type UserSearch = z.infer<typeof userSearchSchema>;

export const Route = createFileRoute('/_protected/_admin/users/')({
  validateSearch: (search) => userSearchSchema.parse(search),
  component: GetUsersPage,
});
