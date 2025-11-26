import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/services/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/services/create"!</div>
}
