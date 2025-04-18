import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

/**
 * # Register
 * 
 * Register the router instance for type safety.
 */
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

/**
 * # Router
 * 
 * Create a new router instance using the Tanstack router.
 * 
 * The router instance is used to manage the application's routing and navigation.
 * 
 * The createRouter function takes the Vite generated route tree and React contexts
 * that we want to pass down through Tanstack Router as an arguments.
 * 
 * @returns Router
 * @description The router instance is used to manage the application's routing and navigation.
 */
export const router = createRouter({
  // Use the Vite generated route tree.
  routeTree,

  // Preload the route tree on the server and on the client when the app is first loaded.
  // defaultPreload: "intent",

  // Enable scroll restoration on the client.
  // This will restore the scroll position when navigating back and forth.
  // scrollRestoration: true,

  // Add the authentication context to the router.
  // This will make the authentication context available to all routes.
  context: {
    // Authentication will initially be undefined. We'll be passing down the
    // authentication state from within a React component
    authentication: undefined!,
  },
});