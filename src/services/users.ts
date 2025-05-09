//-- ./src/services/users.ts

/**
 * # Users Service
 *
 * The users service is responsible for requesting user data from the backend.
 */

import { Client } from "@/client";
import type {
  CreateUserRequest,
  DeleteUserResponse,
  UserIndexResponse,
  UserResponse,
} from "@/lib/grpc/users";
import Logger from "@/logger";

/**
 * # Create User Params
 *
 * The CreateUserParams type is used to define the parameters required for creating a new user.
 */
export type CreateUserParams = {
  /**
   * The email of the user
   */
  email: string;

  /**
   * The name of the user
   */
  name: string;

  /**
   * The password of the user
   */
  password: string;

  /**
   * The role of the user
   */
  // TODO this needs to be an enum type in domains
  role: string;

  /**
   * Whether the user is active
   */
  isActive: boolean;

  isVerified: boolean;
};

/**
 * # Index Users Params
 *
 * The IndexUsersParams type is used to define the parameters required for indexing users.
 */
export type IndexUsersParams = {
  /**
   * The limit for the number of users to return
   */
  limit: bigint;

  /**
   * The offset for the number of users to skip
   */
  offset: bigint;
};

/**
 * # Update User Params
 *
 * The UpdateUserParams type is used to define the parameters required for updating a user. This adds to the CreateUserParams by adding the id string of the user.
 */
export type UpdateUserParams = CreateUserParams & {
  id: string;
};

// const USER_SERVICE_DEFAULTS = {
//   INDEX_LIMIT: 10n,
//   INDEX_OFFSET: 0n,
// } as const;

/**
 * # User Service Error
 *
 * The UserServiceError class is used to define errors that occur in the user service.
 */
export class UsersServiceError extends Error {
  constructor(
    message: string,
    public operation:
      | "init"
      | "create"
      | "read"
      | "index"
      | "update"
      | "delete",
    public originalError?: unknown
  ) {
    super(message);
    this.name = "UsersServiceError";
  }
}

/**
 * # Error Messages
 *
 * The ERROR_MESSAGES object is used to define error messages that occur in the user service.
 */
const ERROR_MESSAGES = {
  INIT_FAILED: "Failed to initialize UsersService",
  CREATE_FAILED: "Failed to create user",
  READ_FAILED: "Failed to read user",
  UPDATE_FAILED: "Failed to update user",
  DELETE_FAILED: "Failed to delete user",
  INDEX_FAILED: "Failed to index users",
} as const;

/**
 * Create a new logger object
 *
 * @type {Logger}
 */
const log: Logger = Logger.getInstance();

/**
 * # Users Service
 * 
 * The UsersService class is responsible for handling user-related operations with the backend such as creating, reading, updating, and deleting users.
 * 
 * @class UsersService
 * @implements Singleton pattern for managing a single instance of the service
 * 
 * ## Example
 * 
 * ```typescript
 * import { UsersService } from "@/services/users";
 * 
 * const usersService = await UsersService.getInstance();
 * 
 * let userParams: createUserParams = {
 *  email: "someone@hotmail.com",
 *   name: "Someone",
 *   password: "password",
 *   role: "admin",
 *   isActive: true,
 *   isVerified: true,
 * }
 * const user = await usersService.create(userParams);
 * ```
 */
export class UsersService {
  /**
   * The client to be used for making grpc requests
   *
   * @type {Client}
   */
  private usersClient: ReturnType<Client["usersClient"]>;

  /**
   * Singleton instance of UsersService
   *
   * @type {UsersService}
   */
  private static instance: UsersService;

  /**
   * Private constructor to prevent instantiation
   *
   * @param client - The client to be used for making requests
   */
  private constructor(client: Client) {
    this.usersClient = client.usersClient();
  }

  /**
   * Get the singleton instance of the UsersService
   *
   * @param client - The client to be used for making requests
   * @returns The singleton instance of UsersService
   */
  public static async getInstance(accessToken?: string): Promise<UsersService> {
    if (!UsersService.instance) {
      try {
        const client = await Client.new(accessToken);
        UsersService.instance = new UsersService(client);
      } catch (error) {
        log.error("Failed to initialize UsersService:", error);
        throw new UsersServiceError(ERROR_MESSAGES.INIT_FAILED, "init", error);
      }
    }
    return UsersService.instance;
  }

  /**
   * # Create User
   *
   * Creates a new user in the backend.
   *
   * @param params - User creation parameters `CreateUserParams`
   *
   * @returns Promise resolving to the grpc `UserResponse`
   */
  async create({
    email,
    name,
    password,
    role,
    isActive,
    isVerified,
  }: CreateUserParams): Promise<UserResponse> {
    try {
      const createUserRequestMessage: CreateUserRequest = {
        email,
        name,
        password,
        role,
        isActive,
        isVerified,
      };

      const { response } = await this.usersClient.create(
        createUserRequestMessage
      );

      return response;
    } catch (error) {
      log.error("Error sending create user request:", error);

      // Re-throw a custom error to be handled by the caller
      throw new UsersServiceError(
        ERROR_MESSAGES.CREATE_FAILED,
        "create",
        error
      );
    }
  }

  /**
   * # Read User
   *
   * Reads a user from the backend.
   *
   * @param id - The ID string of the user to read and return
   * @throws {UserServiceError} If user read fails
   * @returns Promise resolving to the grpc `UserResponse`
   */
  async read(id: string): Promise<UserResponse> {
    try {
      const read_user_request = {
        id: id,
      };
      const { response } = await this.usersClient.read(read_user_request);

      return response;
    } catch (error) {
      log.error("Error sending read user request:", error);

      // Re-throw a custom error to be handled by the caller
      throw new UsersServiceError(ERROR_MESSAGES.READ_FAILED, "read", error);
    }
  }

  /**
   * # Index Users
   *
   * Reads an index users from the backend.
   *
   * @param limit - The maximum number of users to return
   * @param offset - The number of users to skip
   * @throws {UserServiceError} If index read fails
   * @returns Promise resolving to the grpc `UserIndexResponse`
   */
  async index({ limit, offset }: IndexUsersParams): Promise<UserIndexResponse> {
    try {
      const indexUsersRequest = {
        limit,
        offset,
      };
      const { response } = await this.usersClient.index(indexUsersRequest);

      return response;
    } catch (error) {
      log.error("Error sending index user request:", error);

      // Re-throw a custom error to be handled by the caller
      throw new UsersServiceError(ERROR_MESSAGES.INDEX_FAILED, "index", error);
    }
  }

  /**
   * # Update User
   *
   * Updates a user in the backend.
   *
   * @param params - User update parameters `UpdateUserParams`
   * @throws {UserServiceError} If update fails
   * @returns Promise resolving to the grpc `UserResponse`
   */
  async update(params: UpdateUserParams): Promise<UserResponse> {
    try {
      const updateUserRequest = {
        id: params.id,
        email: params.email,
        name: params.name,
        password: params.password,
        role: params.role,
        isActive: params.isActive,
        isVerified: params.isVerified,
      };
      const { response } = await this.usersClient.update(updateUserRequest);

      return response;
    } catch (error) {
      log.error("Error sending update user request:", error);

      // Re-throw a custom error to be handled by the caller
      throw new UsersServiceError(
        ERROR_MESSAGES.UPDATE_FAILED,
        "update",
        error
      );
    }
  }

  /**
   * # Delete User
   *
   * Deletes a user in the backend.
   *
   * @param id - The ID string of the user to delete
   * @throws {UserServiceError} If deletion fails
   * @returns Promise resolving to the grpc `DeleteUserResponse`
   */
  async delete(id: string): Promise<DeleteUserResponse> {
    try {
      const deleteUserRequest = {
        id: id,
      };

      const { response } = await this.usersClient.delete(deleteUserRequest);

      return response;
    } catch (error) {
      log.error("Error sending delete user request:", error);

      // Re-throw a custom error to be handled by the caller
      throw new UsersServiceError(
        ERROR_MESSAGES.DELETE_FAILED,
        "delete",
        error
      );
    }
  }
}
