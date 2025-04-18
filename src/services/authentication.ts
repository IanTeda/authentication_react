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

import Logger from "@/logger";
import {
  LoginRequest,
  LogoutResponse,
  RefreshResponse,
  type LoginResponse,
} from "@/lib/grpc/authentication";
import { Client } from "@/client";
import { Empty } from "@/lib/grpc/common";

/**
 * Create a new logger object
 *
 * @type {Logger}
 */
const log: Logger = Logger.getInstance();

/**
 * # Send Authentication Request
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
   * Send login request to authentication client
   */
  try {
    const client = await Client.new();
    const authentication_client = client.authenticationClient();

    /**
     * Create a new authentication request object
     */
    const login_request: LoginRequest = {
      email,
      password,
    };

    // const { response: login_response, headers } =
    //   await authentication_client.login(login_request);
    const response =
      await authentication_client.login(login_request);
    
    log.silly("Login response is: ", response);

    // log.debug("Login response is: ", login_response);

    return response.response;
  } catch (error) {
    log.error("Error sending login request:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * # Send Refresh Request
 *
 * This function request a refresh of the access token from the authentication
 * client. Returning a new access token
 *
 * @returns <RefreshResponse>: a new access token
 */
export async function sendRefreshRequest(): Promise<RefreshResponse> {
  log.debug("Sending refresh request for a new access token.");
  /**
   * Send refresh request to authentication client
   */
  try {
    const client = await Client.new();
    const authentication_client = client.authenticationClient();

    const request_message: Empty = {};

    const { response: refresh_response } =
      await authentication_client.refresh(request_message);

    log.debug("Refresh response is: ", refresh_response);

    return refresh_response;
  } catch (error) {
    log.error("Refresh service request failed with:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * # Send Logout Request
 * 
 * This function attempts to logout the current user in the authentication service.
 * The backend uses the refresh token that the browser sends as a http-only cookie
 * 
 * @returns 
 */
export async function sendLogoutRequest(): Promise<LogoutResponse> {
  log.debug("Send logout request to the authentication service");

  try {
    const client = await Client.new();
    const authentication_client = client.authenticationClient();

    const request_message: Empty = {};

    const { response: logout_response } =
      await authentication_client.logout(request_message);

    log.debug("Refresh response is: ", logout_response);

    return logout_response;
  } catch (error) {
    log.error("Error sending refresh request:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
