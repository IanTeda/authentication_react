import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unprotected/logout')({
  component: LogoutRouteComponent,
})

function LogoutRouteComponent() {
  return <div>Hello "/_unprotected/logout"!</div>
}
