//-- ./src/App.tsx

/**
 * @file App.tsx
 * @description This file is the main entry point of the application. It sets up the React application,
 * the Tanstack Query client, and the authentication context.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthentication } from "./components/AuthenticationProvider";
import { RouterProvider } from "@tanstack/react-router";
import "@/index.css";
import { router } from "./router";

/**
 * Tanstack Query Client
 * 
 * Initiate a new instance of the Tanstack Query Client to manage server state 
 * and caching in the application.
 * 
 * @constant {QueryClient} queryClient
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

/**
 * Main React application component.
 * Sets up Tanstack Query and authentication context providers.
 * @returns {JSX.Element} The root application component.
 */
export function App() {
  // Use the authentication context to provide authentication state and methods 
  // to the rest of the application. This is a custom hook that is defined in
  // the `./src/components/AuthenticationProvider.tsx` file.
  // The authentication context needs to also be defined in the router context 
  // within the `./src/router.tsx` file.
  const authentication = useAuthentication();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ authentication }} />
    </QueryClientProvider>
  );
}
