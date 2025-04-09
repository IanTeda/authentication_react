import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/')({
  component: IndexRouteComponent,
})

function IndexRouteComponent() {
  return <div>Hello "/"!</div>
}
