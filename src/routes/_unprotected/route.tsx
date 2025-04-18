import Logger from "@/logger";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

// Import the logger instance
const log = Logger.getInstance();

export const Route = createFileRoute("/_unprotected")({
  beforeLoad: async ({ context }) => {
    log.silly("Before unprotected route load...");

    if (!context.authentication) {
      throw redirect({
        to: "/",
      });
    }
  },
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
