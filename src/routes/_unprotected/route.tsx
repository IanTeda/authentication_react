//-- ./src/routes/_unprotected/route.tsx

/**
 * # Unprotected Route
 * 
 * This is a layout (pathless) route for unprotected routes such as login 
 * and logout.
 * 
 * Redirect is handled in individual routes because we do not wan to redirect the logout route. 
 */

import Logger from "@/logger";
import { createFileRoute, Outlet } from "@tanstack/react-router";

// Import the logger instance
const log = Logger.getInstance();

export const Route = createFileRoute("/_unprotected")({
  component: UnprotectedRouteComponent,
});

function UnprotectedRouteComponent() {
  log.silly("UnprotectedRouteComponent rendered");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Outlet />
    </div>
  );
}
