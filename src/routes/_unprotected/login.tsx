import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unprotected/login')({
  component: LoginComponent,
})

function LoginComponent() {
  return <div>Hello "/_unprotected/login"!</div>
}
