//-- ./tests/api/helpers/spawn/client.ts

/**
 * @file client.ts
 * @description This file is responsible for creating the GRPC client and
 * handling the authentication and sessions clients. The client is a singleton
 * and is responsible for creating the transport layer and the client instances.
 */

import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { configuration } from "./configuration";
import { AuthenticationServiceClient } from "./lib/grpc/authentication.client";
import { SessionsServiceClient } from "./lib/grpc/sessions.client";
import { UsersServiceClient } from "./lib/grpc/users.client";
import Logger from "./logger";
import { isValidUrl } from "./lib/utils";
import { UtilitiesServiceClient } from "./lib/grpc/utilities.client";
import authInterceptor from "./lib/authInterceptor";

// Import the logger instance
const log = Logger.getInstance();

/**
 * Convenience type alias for authentication client.
 */
export type AuthenticationClientType = AuthenticationServiceClient;

/**
 * Convenience type alias for sessions client
 */
export type SessionsClientType = SessionsServiceClient;

/**
 * Convenience type alias for users client
 */
export type UsersClientType = UsersServiceClient;

/**
 * Convenience type alias for utilities client
 */
export type UtilitiesClientType = UtilitiesServiceClient;

/**
 * # GRPC Client
 *
 * The client is responsible for handling all GRPC requests to the backend. The
 * client is responsible for creating the transport layer and the client instances.
 * The client is also responsible for handling the authentication and sessions
 * clients.
 */
export class Client {
  private static instance: Client;

  private authentication: AuthenticationClientType;
  private sessions: SessionsClientType;
  private users: UsersClientType;
  private utilities: UtilitiesClientType;

  /**
   * # Client Constructor
   *
   * Create a new instance of the client. The constructor is private to prevent
   * instantiation of the client from outside the class. The constructor accepts
   * the authentication, sessions, users and utilities clients as parameters.
   *
   * @param authentication
   * @param sessions
   * @param users
   * @param utilities
   */
  constructor(
    authentication: AuthenticationClientType,
    sessions: SessionsClientType,
    users: UsersClientType,
    utilities: UtilitiesClientType
  ) {
    this.authentication = authentication;
    this.sessions = sessions;
    this.users = users;
    this.utilities = utilities;
  }

  /**
   * Returns the singleton instance of the client.
   *
   * @param accessToken? - Optionally set an access token to use in the grpc request
   * @returns {Promise<Client>} The singleton instance of the client.
   */
  public static async getInstance(): Promise<Client> {
    if (!Client.instance) {
      Client.instance = await Client.new();
    }
    return Client.instance;
  }

  /**
   * Returns the authentication client.
   */
  public authenticationClient(): AuthenticationClientType {
    return this.authentication;
  }

  /**
   * Returns the sessions client.
   */
  public sessionsClient(): SessionsClientType {
    return this.sessions;
  }

  /**
   * Returns the users client.
   */
  public usersClient(): UsersClientType {
    return this.users;
  }

  public utilitiesClient(): UtilitiesClientType {
    return this.utilities;
  }

  /**
   * Spawn a new tonic client based on the tonic server
   */
  public static async new(accessToken?: string): Promise<Client> {
    try {
      const baseUrl = configuration.AUTHENTICATION_BASE_URL;

      // TODO: Move this to a domain type
      if (!baseUrl || !isValidUrl(baseUrl)) {
        throw new Error("Invalid authentication base URL");
      }

      // Create a new GRPC transport layer
      const transport = new GrpcWebFetchTransport({
        baseUrl,
        // TODO make this configurable > configuration.GRPC_DEADLINE || 30_000, // Default to 30 seconds
        deadline: 30_000, // 30 seconds
        interceptors: [authInterceptor(accessToken)],
        // !!Important!!: I am needed for GRPCWeb to pass the cookie header to the browser
        fetchInit: {
          credentials: "include",
        },
      });

      log.debug("Transport layer created: ", transport);

      const authentication: AuthenticationClientType =
        new AuthenticationServiceClient(transport);
      const sessions: SessionsClientType = new SessionsServiceClient(transport);
      const users: UsersClientType = new UsersServiceClient(transport);
      const utilities: UtilitiesClientType = new UtilitiesServiceClient(
        transport
      );

      return new Client(authentication, sessions, users, utilities);

      // TODO: Add connection verification with a ping request
    } catch (error) {
      log.error("Error spawning client:", error);
      throw new Error(
        `Failed to create client: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
