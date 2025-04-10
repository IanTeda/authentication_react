import { LogOutCard } from '@/components/LogoutCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unprotected/logout')({
  component: LogoutRouteComponent,
})

function LogoutRouteComponent() {
  return (
    <div className="w-full max-w-sm md:max-w-3xl">
      <LogOutCard />
    </div>
  )
}
