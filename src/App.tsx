import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthentication } from "./components/AuthenticationProvider";
import { RouterProvider } from "@tanstack/react-router";
import "@/index.css";
import { router } from "./router";

// Initiate a new Tanstack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

// React application function
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
