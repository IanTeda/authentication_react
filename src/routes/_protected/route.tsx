import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  component: ProtectedRouteComponent,
})

function ProtectedRouteComponent() {
  return <div>Hello "/_protected"!</div>
}
