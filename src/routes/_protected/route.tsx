//-- ./src/routes/_protected/route.tsx

/**
 * 
 */

import { AppHeader } from '@/components/AppHeader';
import Logger from '@/logger';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

// Import the logger instance
const log = Logger.getInstance();

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context, location }) => {
    log.silly("Before protected layout load...");

    if (!context.authentication.accessToken) {
      throw redirect({
        to: "/login",
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href as "/" | "/account",
        },
      });
    }
  },
  component: ProtectedRouteComponent,
});

function ProtectedRouteComponent() {
  log.silly('ProtectedRouteComponent rendered');

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-grow p-4">

        <h1 className="text-2xl font-bold">Protected Route</h1>
        <p>This route is protected and requires authentication.</p>
        <p>Only authenticated users can access this content.</p>
        <p>Check the authentication logic in the route file.</p>
        <p>Make sure to implement the authentication check in your application.</p>
      
        <Outlet />
        </main>
      <footer className="bg-gray-800 text-white p-4">
        <p>&copy; 2023 My Application. All rights reserved.</p>
      </footer>

    </div>
  );
}
