import { LogOutCard } from "@/components/LogoutCard";
import Logger from "@/logger";
import { createFileRoute } from "@tanstack/react-router";

// Import the logger instance
const log = Logger.getInstance();

export const Route = createFileRoute("/_unprotected/logout")({
  beforeLoad: async ({ context }) => {
    log.silly("Before logout route load...");

    context.authentication.handleLogout();
  },
  component: LogoutRouteComponent,
});

function LogoutRouteComponent() {
  return (
    <div className="w-full max-w-sm md:max-w-3xl">
      <LogOutCard />
    </div>
  );
}
