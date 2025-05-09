import { useAuthentication } from "@/components/AuthenticationProvider";
import { columns } from "@/components/users/Column";
import { UsersDataTable } from "@/components/users/DataTable";
import Logger from "@/logger";
import { useUsersIndexQuery } from "@/queries/users";
import { createFileRoute } from "@tanstack/react-router";

/**
 * Create a new logger object
 *
 * @type {Logger}
 */
const log: Logger = Logger.getInstance();

export const Route = createFileRoute("/_protected/users")({
  component: RouteComponent,
});

function RouteComponent() {
  // Grab authentication global context (scope) from the context provider
  const { accessToken } = useAuthentication();

  const { data, isLoading, error, isError } = useUsersIndexQuery(accessToken ?? undefined);

  // Return early if no access token
  if (!accessToken) {
    return <div>Please log in to view users</div>;
  }

  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        Loading users...
      </div>
    );
  }

  if (isError) {
    log.error("Error loading users:", error);
    return (
      <div role="alert" aria-live="assertive">
        <h2>Error</h2>
        <p>
          Failed to load users:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <UsersDataTable columns={columns} data={data?.users ?? []} />
    </div>
  );
}
