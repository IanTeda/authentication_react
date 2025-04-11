//-- ./src/services/authentication.ts

/**
 * ## Authentication Service
 *
 * The authentication service is responsible for handling user authentication with
 * the application. The service provides a login method that accepts an email and
 * password and returns a authentication response from the backend.
 *
 * @packageDocumentation
 * @module services/authentication
 * @category Services
 * @subcategory Authentication
 */

import { configuration } from "@/configuration";
import { AuthenticationServiceClient } from "@/lib/grpc/authentication.client";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import Logger from "@/logger";
import { LoginRequest, type LoginResponse } from "@/lib/grpc/authentication";

/**
 * Create a new logger object
 *
 * @type {Logger}
 */
const log: Logger = Logger.getInstance();

/**
 * ### Send Authentication Request
 *
 * The sendAuthenticationRequest function is responsible for sending an authentication
 * request to the backend. The function accepts an email and password and returns a
 * authentication response from the backend.
 *
 * @param email
 * @param password
 * @returns AuthenticationResponse
 */
export async function sendLoginRequest(
  email: string,
  password: string
): Promise<LoginResponse> {
  log.debug("Sending authentication request to server.");

  /**
   * Create a new GRPC transport layer
   * TODO: Abstract transport layer for other services to use
   */
  const transport = new GrpcWebFetchTransport({
    baseUrl: configuration.AUTHENTICATION_BASE_URL,
  });

  /**
   * Create a new authentication client
   */
  const authentication = new AuthenticationServiceClient(transport);

  /**
   * Create a new authentication request object
   */
  const authentication_request = LoginRequest.create({
    email: email,
    password: password,
  });

  /**
   * Send authentication request to authentication client
   */
  try {
    const { response: login_response } = await authentication.login(
      authentication_request
    );

    log.debug("Login response is: ", login_response);

    return login_response;
  } catch (error) {
    log.error("Error sending login request:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
