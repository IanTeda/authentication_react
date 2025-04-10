import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import TanStackDevTools from '@/components/TanStackDevTools';

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
      <TanStackDevTools />
    </React.Fragment>
  );
}
