//-- ./tests/api/helpers/spawn/client.ts

import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { configuration } from "./configuration";
import { AuthenticationServiceClient } from "./lib/grpc/authentication.client";
import { SessionsServiceClient } from "./lib/grpc/sessions.client";
import { UsersServiceClient } from "./lib/grpc/users.client";
import Logger from "./logger";
import { isValidUrl } from "./lib/utils";

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
 * # GRPC Client
 *
 * The client is responsible for handling all GRPC requests to the backend. The
 * client is responsible for creating the transport layer and the client instances.
 * The client is also responsible for handling the authentication and sessions
 * clients.
 */
export class Client {
  private authentication: AuthenticationClientType;
  private sessions: SessionsClientType;
  private users: UsersClientType;

  constructor(
    authentication: AuthenticationClientType,
    sessions: SessionsClientType,
    users: UsersClientType
  ) {
    this.authentication = authentication;
    this.sessions = sessions;
    this.users = users;
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

  /**
   * Spawn a new tonic client based on the tonic server
   */
  public static async new(): Promise<Client> {
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

      return new Client(authentication, sessions, users);

      // TODO: Add connection verification with a ping request
    } catch (error) {
      log.error("Error spawning client:", error);
      throw new Error(
        `Failed to create client: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
