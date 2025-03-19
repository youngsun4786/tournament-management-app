import { createFileRoute } from '@tanstack/react-router'
import { CaptainDashboard } from '~/lib/components/captain/dashboard'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CaptainDashboard />
}
