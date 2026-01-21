import { createFileRoute, redirect, type SearchSchemaInput } from '@tanstack/react-router'
import SingleContactGroupPage from "@/pages/groups/SingleContactGroupPage.tsx";

type GroupSearch = {
  tab: 'members' | 'services' | 'info'
}

export const Route = createFileRoute('/_protected/_admin/groups/$uuid')({
  component: SingleContactGroupPage,
  validateSearch: (search: Record<string, unknown> & SearchSchemaInput): GroupSearch => {
    return {
      tab: (search.tab as GroupSearch['tab']) || 'info',
    }
  },
  beforeLoad: ({ search, params }) => {
    if (!search.tab) {
      throw redirect({
        to: Route.fullPath,
        params,
        search: { tab: 'info' },
        replace: true,
      })
    }
  },
})
