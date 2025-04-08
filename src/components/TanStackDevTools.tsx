//-- ./src/components/TanStackDevTools.tsx

// # TanStackDevTools Component
//
// This component is responsible for adding the TanStack development tools to the app.
//
// The TanStack development tools are a set of tools that help developers debug and
// optimize their applications. They include the TanStack Router Devtools and the
// TanStack Query Devtools.
//
// ## References
//
// - [TanStack Router Devtools](https://tanstack.com/router/latest/docs/devtools)
// - [TanStack Query Devtools](https://tanstack.com/query/latest/docs/devtools)
// - [axelrindle/mjml.app](https://github.com/axelrindle/mjml.app/blob/main/src/compone/nts/Devtools.tsx

// Import the necessary modules
import { lazy, Suspense } from "react";

// Lazy load the TanStackRouterDevtools component
// This is used to add the TanStack Router Devtools to the app
// The TanStackRouterDevtools component is only loaded in development mode
// and is not included in the production build
const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/react-router-devtools")
          .then((res) => ({
            default: res.TanStackRouterDevtools,
          }))
          .catch(() => ({
            default: () => <div>Error loading Tanstack Router Devtools</div>,
          }))
      );

// Lazy load the TanStackQueryDevtools component
// This is used to add the React Query Devtools to the app
// The TanStackQueryDevtools component is only loaded in development mode
// and is not included in the production build
const TanStackQueryDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/react-query-devtools")
          .then((res) => ({
            default: res.ReactQueryDevtools,
          }))
          .catch(() => ({
            default: () => <div>Error loading TanStack Query Devtools</div>,
          }))
      );

// Export the TanStackDevTools component
export default function TanStackDevTools() {
  return (
    <>
      {/* // Wrap the TanStackRouterDevtools component in a Suspense component so it shows a fallback while loading and then the dev tools after they are loaded */}
      <Suspense fallback={<div>Loading Devtools...</div>}>
        <TanStackRouterDevtools position="bottom-right" />
        <TanStackQueryDevtools buttonPosition="bottom-right" />
      </Suspense>
    </>
  );
}
