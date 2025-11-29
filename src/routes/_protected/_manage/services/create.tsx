import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_manage/services/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/_manage/services/create"!</div>
}
