import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_manage/services/$uuid')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/_manage/services/$uuid"!</div>
}
