import { createFileRoute } from '@tanstack/react-router'
import GetUsersPage from '@/pages/users/GetUsersPage'

export const Route = createFileRoute('/_protected/_admin/users/')({
  component: GetUsersPage,
  // define the query/search parameters
  searchSchema: {
    page: Number,
    pageSize: Number,
    sort: String,
    // add other possible filters dynamically if needed
  },
})
