//-- ./src/routes/_unprotected/authenticating.tsx
/**
 * # Authenticating Route
 *
 * This route waits for the Authentication Provider to attempt to get a refreshed
 * access token. If this fails it redirects to the login page. This is done through
 * the useEffect hook which checks the authentication state change and redirects accordingly.
 */

import { useAuthentication } from "@/components/AuthenticationProvider";
import Logger from "@/logger";
import {
  createFileRoute,
  useRouter,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";


// Import the logger instance
const log = Logger.getInstance();

// Improve type safety by defining the redirect paths
type RedirectPath = "/" | "/account" | "/users";


// URL search schema to validate against
const redirectSearchSchema = z.object({
  redirect: z.enum(["/", "/account", "/users"]).catch("/"),
});

/**
 * # Define Tanstack Router route
 */
export const Route = createFileRoute("/_unprotected/authenticating")({
  validateSearch: (search) => redirectSearchSchema.parse(search),
  component: AuthenticatingRouteComponent,
});

/**
 * # Authentication Route Component
 * 
 * The Tanstack route component for the authenticating page.
 */
function AuthenticatingRouteComponent() {
  // Grab authentication global context (scope) from the context provider
  const { isLoading, isAuthenticated } = useAuthentication();

  // Get the Tanstack router global context from the provider
  const router = useRouter();

  // Deconstruct the redirect search URL parameter
  const { redirect } = Route.useSearch();

  // When async useSate for isLoading is updated
  useEffect(() => {
    if (!isLoading) {
      // Check the current user is not `undefined` or `null`, i.e. authenticated
      if (isAuthenticated) {
        log.debug("Current user authenticated, redirecting.");
        
        // Navigate to application entry point
        router.navigate({ to: redirect as RedirectPath });
      } else {
        log.debug(
          "Unable to authenticate current user, redirecting to login page."
        );

        // Navigate to the login route, passing on the redirect search URL parameter
        router.navigate({
          to: "/login",
          search: {
            redirect: redirect as RedirectPath,
          },
        });
      }
    }
  }, [isAuthenticated, isLoading, redirect, router]);

  return (
    <div>
      <span className="flex items-center gap-3 text-xl">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Authenticating: Attempting to fetch an access token...</span>
      </span>
    </div>
  );
}
