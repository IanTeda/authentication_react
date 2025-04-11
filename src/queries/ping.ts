//-- ./src/queries/ping.ts

import { PingResponse } from "@/lib/grpc/utilities";
import { sendPintRequest as sendPingRequest } from "@/services/utilities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Logger from "@/logger";

/**
 * ## Logger Instance
 *
 * Create a new logger instance to log messages to the console.
 *
 */
const log = Logger.getInstance();

/**
 * ## Ping Query Key
 *
 * The ping query key is used to identify the ping query in the query cache.
 */
const PING_QUERY_KEY = "ping";

/**
 * ### Use Ping Query
 *
 * The usePingQuery hook is a TanStack Query hook that is used to send a ping
 * request to the backend.
 *
 * @returns
 */
export function usePingQuery() {
  return useQuery({
    queryKey: [PING_QUERY_KEY],
    queryFn: async (): Promise<PingResponse> => sendPingRequest(),
  });
}

export function usePingMutation() {
  log.debug("Creating a new ping mutation hook");

  const queryClient = useQueryClient();

  // Return the TanStack Query useMutation hook
  return useMutation({
    mutationKey: [PING_QUERY_KEY],
    // Parameters need to be wrapped in an object
    mutationFn: async (): Promise<PingResponse> => {
      // send an authentication request to the backend.
      // Mutation function must return a value to meet promise
      return sendPingRequest();
    },

    // Do something with the mutation function data returned
    onSuccess: (data: PingResponse) => {
      log.debug("Ping mutation was successful");

      // Set the TokenResponse data in the query cache
      queryClient.setQueryData([PING_QUERY_KEY], data);

      // Set local session storage for the access token
      sessionStorage.setItem("auth_server_status", data.message);
    },
  });
}
