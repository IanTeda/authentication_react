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
 * Create a new logger object
 *
 * @type {Logger}
 */
const log: Logger = Logger.getInstance();

class UsersService {
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
  public static async getInstance(): Promise<UsersService> {
    if (!UsersService.instance) {
      try {
        const client = await Client.new();
        UsersService.instance = new UsersService(client);
      } catch (error) {
        log.error("Failed to initialize UsersService:", error);
        throw new UsersServiceError(
          "Failed to initialize UsersService",
          "init",
          error
        );
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
  async create(params: CreateUserParams): Promise<UserResponse> {
    try {
      const createUseRequest: CreateUserRequest = {
        email: params.email,
        name: params.name,
        password: params.password,
        role: params.role,
        isActive: params.isActive,
        isVerified: params.isVerified,
      };

      const { response } = await this.usersClient.create(createUseRequest);

      return response;
    } catch (error) {
      log.error("Error sending create user request:", error);

      // Re-throw a custom error to be handled by the caller
      throw new UsersServiceError("Failed to create user", "create", error);
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
      throw new UsersServiceError("Failed to reading a user", "read", error);
    }
  }

  /**
   * # Index Users
   *
   * Reads an index users from the backend.
   *
   * @param params - User index parameters `IndexUsersParams`
   * @throws {UserServiceError} If index read fails
   * @returns Promise resolving to the grpc `UserIndexResponse`
   */
  async index(params: IndexUsersParams): Promise<UserIndexResponse> {
    try {
      const indexUsersRequest = {
        limit: params.limit,
        offset: params.offset,
      };
      const { response } = await this.usersClient.index(indexUsersRequest);

      return response;
    } catch (error) {
      log.error("Error sending index user request:", error);

      // Re-throw a custom error to be handled by the caller
      throw new UsersServiceError("Failed to index users", "index", error);
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
      throw new UsersServiceError("Failed to update the user", "update", error);
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
      throw new UsersServiceError("Failed to update user", "update", error);
    }
  }
}

// /**
//  * # Send Create User Request
//  *
//  * The sendCreateUserRequest function is responsible for sending a create user
//  * request to the backend. The function accepts an email, name, password,
//  * role, isActive, and isVerified and returns a user response from the backend.
//  *
//  * @param email
//  * @param name
//  * @param password
//  * @param role
//  * @param isActive
//  * @param isVerified
//  * @returns Promise<UserResponse>
//  */
// export async function createUserRequest(
//   email: string,
//   name: string,
//   password: string,
//   role: string,
//   isActive: boolean,
//   isVerified: boolean
// ): Promise<UserResponse> {
//   try {
//     const client = await Client.new();
//     const users_client = client.usersClient();

//     const create_user_request: CreateUserRequest = {
//       email: email,
//       name: name,
//       password: password,
//       role: role,
//       isActive: isActive,
//       isVerified: isVerified,
//     };

//     const { response } = await users_client.create(create_user_request);

//     return response;
//   } catch (error) {
//     log.error("Error sending create user request:", error);

//     // Re-throw the error to be handled by the caller
//     throw error;
//   }
// }

// /**
//  * # Read User
//  *
//  * The readUser function is responsible for sending a read user request to the backend.
//  * The function accepts an id and returns a user response from the backend.
//  *
//  * @param id
//  * @returns Promise<UserResponse>
//  */
// export async function readUser(id: string): Promise<UserResponse> {
//   try {
//     const client = await Client.new();
//     const users_client = client.usersClient();

//     const read_user_request = {
//       id: id,
//     };
//     const { response } = await users_client.read(read_user_request);

//     return response;
//   } catch (error) {
//     log.error("Error sending read user request:", error);

//     // Re-throw the error to be handled by the caller
//     throw error;
//   }
// }

// export async function indexUsers(
//   limit: bigint,
//   offset: bigint
// ): Promise<UserIndexResponse> {
//   try {
//     const client = await Client.new();
//     const users_client = client.usersClient();

//     const index_users_request = {
//       limit: limit,
//       offset: offset,
//     };
//     const { response } = await users_client.index(index_users_request);

//     return response;
//   } catch (error) {
//     log.error("Error sending index user request:", error);

//     // Re-throw the error to be handled by the caller
//     throw error;
//   }
// }

// export async function updateUser(
//   id: string,
//   email: string,
//   name: string,
//   password: string,
//   role: string,
//   isActive: boolean,
//   isVerified: boolean
// ): Promise<UserResponse> {
//   try {
//     const client = await Client.new();
//     const users_client = client.usersClient();

//     const update_user_request = {
//       id: id,
//       email: email,
//       name: name,
//       password: password,
//       role: role,
//       isActive: isActive,
//       isVerified: isVerified,
//     };
//     const { response } = await users_client.update(update_user_request);

//     return response;
//   } catch (error) {
//     log.error("Error sending update user request:", error);

//     // Re-throw the error to be handled by the caller
//     throw error;
//   }
// }

// export async function deleteUser(id: string): Promise<DeleteUserResponse> {
//   try {
//     const client = await Client.new();
//     const users_client = client.usersClient();

//     const delete_user_request = {
//       id: id,
//     };

//     const { response } = await users_client.delete(delete_user_request);

//     return response;
//   } catch (error) {
//     log.error("Error sending delete user request:", error);

//     // Re-throw the error to be handled by the caller
//     throw error;
//   }
// }
