import { LoginForm } from "@/components/LoginForm";
import Logger from "@/logger";
import { createFileRoute, redirect } from "@tanstack/react-router";

// Import the logger instance
const log = Logger.getInstance();

export const Route = createFileRoute("/_unprotected/login")({
  beforeLoad: async ({context}) => {
    log.silly("Before load login component route")
    if (context.authentication.currentUser) {
      log.silly("User is already authenticated, redirecting to /");
      throw redirect({
        to: "/",
      });
    };
  },
  component: LoginComponentRoute,
});

function LoginComponentRoute() {

  return (
    <div className="w-full max-w-sm md:max-w-3xl">
      <LoginForm />
    </div>
  );
}
