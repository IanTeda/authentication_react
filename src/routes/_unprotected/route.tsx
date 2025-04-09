import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unprotected')({
  component: UnprotectedRouteComponent,
})

function UnprotectedRouteComponent() {
  return <div>Hello "/_unprotected"!</div>
}
