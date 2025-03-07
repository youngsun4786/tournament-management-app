import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/standings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/standings/"!</div>
}
