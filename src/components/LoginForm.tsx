//-- ./src/components/LoginForm.tsx

/**
 * # Login Form
 *
 * Login form component for authenticating with the backend server
 *
 * This component takes the email and password in the form and sends it to the
 * Authentication service module for verification.
 *
 * On authentication the user is redirected to there entrypoint or app root if
 * no redirect is defined.
 *
 * ## References
 *
 * - [cosdensolutions](https://github.com/cosdensolutions/code/tree/master/videos/long/role-based-authentication-in-react)
 */

//  Import external libraries
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/shadcn_ui/button";
import { Card, CardContent } from "@/components/shadcn_ui/card";
import { Input } from "@/components/shadcn_ui/input";
import { Label } from "@/components/shadcn_ui/label";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/shadcn_ui/alert";
import { useAuthentication } from "@/components/AuthenticationProvider";
import { cn } from "@/lib/utils";
import splash_image from "@/assets/images/login_splash1.jpg";
import Logger from "@/logger";
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { getRouteApi, useRouter } from "@tanstack/react-router";

// Import the logger instance
const log = Logger.getInstance();

// Define allowed redirect paths
type RedirectPath = "/" | "/account";

/**
 * # Login Button
 *
 * A Shadcn button for submitting a login request
 *
 * @returns Button
 */
export function LoginButton() {
  return (
    <Button type="submit" className="w-full">
      Login
    </Button>
  );
}

/**
 * # Loading Button
 *
 * A button component that shows a loading animation.
 *
 * @returns Button
 */
export function LoadingButton() {
  return (
    <Button disabled>
      <Loader2 className="animate-spin" />
      Logging in ...
    </Button>
  );
}

/**
 * # Login Alert
 *
 * An alert box for when there is an error logging in
 *
 * @param message - The error message to display
 * @returns <Alert>
 */
export function LoginAlert({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="w-1/2">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

/**
 * # Login Form
 *
 * The login form component for rendering and managing login submit
 *
 * @param param0
 * @returns
 */
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  log.silly("LoginForm rendered");

  // Use the login handler in the Authentication Context Provider
  const { handleLogin } = useAuthentication();

  // Track login component state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error message component state
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Setup Tanstack router for navigation
  const router = useRouter();
  const routeApi = getRouteApi("/_unprotected/login");
  const routeSearch = routeApi.useSearch() as { redirect?: RedirectPath };

  // Initialize the form using @tanstack/react-form
  const form = useForm({
    // Set the default values for the form fields
    defaultValues: {
      email: "default_ams@teda.id.au",
      // cSpell:ignore S3cret
      password: "S3cret-Admin-Pas$word!",
    },
    // Form submission handler
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      setErrorMessage("");

      try {
        log.silly("Form submitted with values:", value);

        // Wait for 1000 milliseconds during testing
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        await handleLogin(value.email, value.password);

        // Only redirects on successful login, errors go into `error` block
        if (routeSearch.redirect) {
          router.navigate({ to: routeSearch.redirect as RedirectPath });
        } else {
          router.navigate({ to: "/" });
        }
      } catch (error) {
        // Don't handle redirect errors
        if (error instanceof Error && error.name !== "RedirectError") {
          const message =
            error instanceof Error
              ? error.message
              : "Login failed. Please try again.";
          log.error("Login error:", message);
          setErrorMessage(decodeURI(message));
        } else {
          // Re-throw redirect
          throw error;
        }
      } finally {
        // Reset submitting state
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Authentication Service account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <form.Field
                  name="email"
                  children={(field) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder="me@example.com"
                      autoComplete="username email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                  )}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <form.Field
                  name="password"
                  children={(field) => (
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="***************"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                  )}
                />
              </div>
              {isSubmitting ? <LoadingButton /> : <LoginButton />}
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={splash_image}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
      {errorMessage && <LoginAlert message={errorMessage} />}
    </div>
  );
}
