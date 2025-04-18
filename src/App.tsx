import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthentication } from "./components/AuthenticationProvider";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import "@/index.css";

// Initiate a new Tanstack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    authentication: undefined!, // We'll set this in React-land
  },
});

// React application function
export function App() {
  const authentication = useAuthentication();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ authentication }} />
    </QueryClientProvider>
  );
}
