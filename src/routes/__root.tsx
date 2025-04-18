import * as React from 'react'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import TanStackDevTools from '@/components/TanStackDevTools';
import type { useAuthentication } from '@/components/AuthenticationProvider';

/**
 * # Router Context
 * 
 * Pass global context to the router context
 */
interface MyRouterContext {
  authentication: ReturnType<typeof useAuthentication>;
}

/**
 * # Tanstack Router
 */
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

/**
 * # Root Component
 * 
 * @returns 
 */
function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
      <TanStackDevTools />
    </React.Fragment>
  );
}
