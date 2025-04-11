//-- ./src/queries/authentication.ts

/**
 * ## Authentication Query Hook
 *
 * This hook is used to authenticate a user with the application. It accepts an email
 * and password and returns the authentication response from the backend.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Logger from "@/logger";
import type { LoginResponse } from "@/lib/grpc/authentication";
import { sendLoginRequest } from "@/services/authentication";

/**
 * ## Logger Instance
 *
 * Create a new logger instance to log messages to the console.
 */
const log = Logger.getInstance();

const AUTHENTICATION_QUERY_KEY = "authentication";

// TODO: I am structured different to the mutation hook, why?
export function useLoginQuery(email: string, password: string) {
  return useQuery({
    queryKey: [AUTHENTICATION_QUERY_KEY],
    queryFn: async (): Promise<LoginResponse> =>
      sendLoginRequest(email, password),
  });
}

// ## Authentication Mutation Hook
//
// This hook is used to authenticate a user with the backend. It accepts an email
// and password and mutates (changes) the ResponseToken stored in the TanStack Query
// cache.
// It calls the sendAuthenticationRequest function from the services/authentication.ts
// file to send the authentication request to the backend.
export function useAuthenticationMutation() {
  log.debug("Use authentication mutation hook");

  const queryClient = useQueryClient();

  // Return the TanStack Query useMutation hook
  return useMutation({
    mutationKey: [AUTHENTICATION_QUERY_KEY],
    // Parameters need to be wrapped in an object
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<LoginResponse> => {
      // send an authentication request to the backend.
      // Mutation function must return a value to meet promise
      return sendLoginRequest(email, password);
    },

    // Do something with the mutation function data returned
    onSuccess: (data) => {
      log.debug(
        "Authentication mutation was successful. Updating cache and sessions storage."
      );

      // Set the TokenResponse data in the query cache
      queryClient.setQueryData([AUTHENTICATION_QUERY_KEY], data);

      // Set local session storage for the access token
      sessionStorage.setItem("accessToken", data.accessToken);
    },
  });
}
