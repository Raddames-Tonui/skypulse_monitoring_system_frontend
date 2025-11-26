import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/services/$update')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/services/uuidedit"!</div>
}
