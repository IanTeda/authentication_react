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
