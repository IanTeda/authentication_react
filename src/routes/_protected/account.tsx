import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/account')({
  component: AccountRouteComponent,
})

function AccountRouteComponent() {
  return <div>Hello "/_protected/account"!</div>
}
