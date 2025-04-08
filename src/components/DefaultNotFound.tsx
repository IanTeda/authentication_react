//-- ./src/components/DefaultNotFound.tsx

// # DefaultNotFound
//
// This is the default 404 page. It is displayed when no other route is matched. I am set in the createRouter instance configuration in src/main.tsx.
//
// ## References
//
// - [Docs - Not Found Route](https://tanstack.com/router/latest/docs/framework/react/guide/creating-a-router#not-found-route)
// - [TanStack/router](https://github.com/TanStack/router/blob/main/docs/framework/react/guide/not-found-errors.md)

import { Link } from "@tanstack/react-router";

// Function component DefaultNotFound
function DefaultNotFound() {
  return (
    <div>
      <p>Not found! ./src/components/NotFound.tsx</p>
      <Link to="/">Go home</Link>
    </div>
  );
}

// Export the component
export default DefaultNotFound;
