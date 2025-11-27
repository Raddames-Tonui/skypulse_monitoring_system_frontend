import SingleContactGroupPage from '@/pages/groups/SingleContactGroupPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/groups/$uuid')({
  component: SingleContactGroupPage,
})

