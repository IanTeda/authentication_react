import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Import global styles
import './index.css';

// Initiate a new Tanstack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
};

// Create a new router instance
const router = createRouter({ routeTree });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* // Wrap the application in a Tanstack QueryClientProvider for context */}
    <QueryClientProvider client={queryClient}>
      {/* // Pass the router instance to the RouterProvider */}
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
