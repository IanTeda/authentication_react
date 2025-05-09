//-- ./src/queries/ping.ts

/**
 * # Ping Query
 *
 * The ping query is used to send a ping request to the backend. The query returns
 * a PingResponse object.
 *
 * @packageDocumentation
 * @module queries/ping
 * @category Queries
 * @subcategory Ping
 */

import { PingResponse } from "@/lib/grpc/utilities";
import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import Logger from "@/logger";
import { UtilitiesService } from "@/services/utilities";

/**
 * ## Logger Instance
 *
 * Create a new logger instance to log messages to the console.
 *
 */
const log = Logger.getInstance();

const PING = {
  QUERY_KEY: "ping",
  STORAGE_KEY: "auth_server_status",
} as const;

/**
 * # Ping
 *
 * This function is used to send a ping request to the backend. The function
 * returns a promise that resolves to a PingResponse object.
 *
 * @returns {Promise<PingResponse>}
 */
const ping = async (): Promise<PingResponse> => {
  const utilitiesService = await UtilitiesService.getInstance();
  const response = await utilitiesService.ping();
  return response;
};

/**
 * ### Use Ping Query
 *
 * The usePingQuery hook is a TanStack Query hook that is used to send a ping
 * request to the backend.
 *
 * @returns {UseQueryResult<PingResponse, unknown>}
 */
export function usePingQuery(): UseQueryResult<PingResponse, unknown> {
  return useQuery({
    queryKey: [PING.QUERY_KEY],
    queryFn: ping,
    // retry: 2,
    // retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // staleTime: 30000, // 30 seconds
    // gcTime: 30000,
  });
}

/**
 * # Use Ping Mutation
 *
 * The usePingMutation hook is a TanStack Query hook that is used to send a ping.
 *
 * @returns {UseMutationResult<PingResponse, unknown, void>}
 */
export function usePingMutation() {
  log.debug("Creating a new ping mutation hook");

  // Create a new instance of the query client.
  const queryClient = useQueryClient();

  // Return the TanStack Query useMutation hook
  return useMutation({
    mutationKey: [PING.QUERY_KEY],

    // Parameters need to be wrapped in an object
    mutationFn: ping,

    // Do something with the mutation function data returned
    onSuccess: (data: PingResponse) => {
      log.debug("Ping mutation was successful");

      // Set the TokenResponse data in the query cache
      queryClient.setQueryData([PING.QUERY_KEY], data);

      // Set local session storage for the access token
      // sessionStorage.setItem(PING.STORAGE_KEY, data.message);
      try {
        sessionStorage.setItem(PING.STORAGE_KEY, data.message);
      } catch (e) {
        log.warn("Session storage not available:", e);
      }
    },
    onError: (error: Error) => {
      log.error("Ping mutation failed:", error);
    },
  });
}
