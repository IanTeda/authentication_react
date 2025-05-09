import * as React from 'react'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import TanStackDevTools from '@/components/TanStackDevTools';
import type { useAuthentication } from '@/components/AuthenticationProvider';
import type { QueryClient } from '@tanstack/react-query';

/**
 * # Router Context
 * 
 * Pass global context to the router context
 */
interface MyRouterContext {
  /**
   * # Authentication Context
   * 
   * This is a custom hook that is defined in the `./src/components/AuthenticationProvider.tsx` file.
   * The authentication context needs to also be defined in the router context within the `./src/router.tsx` file.
   */
  authentication: ReturnType<typeof useAuthentication>;

  /**
   * # Tanstack Query Client
   * 
   * This is the Tanstack Query client that is used to manage server state in the application.
   * It is created in the `./src/App.tsx` file and passed to the router context.
   */
  queryClient: QueryClient;
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
