import type { UserResponse } from "@/lib/grpc/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  UsersService,
  type CreateUserParams,
  type IndexUsersParams,
  type UpdateUserParams,
} from "@/services/users";
import Logger from "@/logger";
import { userFromUserResponse, type User } from "@/domains/user";

/**
 * Pagination Parameters
 * 
 * Use page-based pagination for easier UI controls, URL sharing and bookmarking and better performance.
 * 
 * TODO
 * - [ ] Consider using optimistic updates for mutations
 */
type PaginationParams = {
  page: number;
  perPage: number;
};

// TODO: update queries below with key structure consts.
const USERS = {
  all: ["users"] as const,
  lists: (params?: { page: number; perPage: number }) =>
    [...USERS.all, "list", params] as const,
  list: (filters: Record<string, unknown>) =>
    [...USERS.lists(), { filters }] as const,
  details: () => [...USERS.all, "detail"] as const,
  detail: (id: string) => [...USERS.details(), id] as const,
} as const;

/**
 * Create a new logger object
 *
 * @type {Logger}
 */
const log: Logger = Logger.getInstance();

/**
 * # Create User Mutation
 *
 * A hook for creating a new user with Tanstack Query and updating the cache.
 * @returns Mutation result for creating a user
 */
export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: CreateUserParams) => {
      const usersService = await UsersService.getInstance();
      return usersService.create(newUser);
    },
    onSuccess: () => {
      // Invalidate user query to refetch the list
      queryClient.invalidateQueries({ queryKey: [USERS.all] });
      log.debug("User created successfully");
    },
    onError: (error: Error) => {
      log.error("Failed to create user: ", error);
    },
  });
}

/**
 * # Users Read Query
 *
 * A hook for reading a user with Tanstack Query.
 *
 * @param id
 * @returns
 */
export function useUsersReadQuery(id: string) {
  return useQuery({
    queryKey: USERS.detail(id),
    queryFn: async (): Promise<UserResponse> => {
      const usersService = await UsersService.getInstance();
      return usersService.read(id);
    },
  });
}

/**
 * # User Index Query
 *
 * A hook for reading an index of users using Tanstack Query
 *
 * @param accessToken? - Optional access token to use in the grpc request
 * @param pagination? - Optional pagination parameters to use in the grpc request
 * @returns
 */
export function useUsersIndexQuery(
  accessToken?: string,
  pagination?: PaginationParams
) {
  // Initialise page and perPage with default values if not provided in function parameters.
  const { page = 1, perPage = 10 } = pagination ?? {};

  return useQuery({
    queryKey: USERS.lists({ page, perPage }),
    queryFn: async (): Promise<{users: User[]}> => {
      // Convert page to offset for backend
      const offset = BigInt((page - 1) * perPage);
      const limit = BigInt(perPage);

      // Build the index users request parameter object.
      const indexUsersRequest: IndexUsersParams = {
        limit,
        offset,
      };

      // Get the user service instance while passing the access token if provided.
      const usersService = await UsersService.getInstance(accessToken);

      // Get the users from the backend
      const response = await usersService.index(indexUsersRequest);

      // Map the UserResponse[] to domain User[]
      const users = response.users.map(userFromUserResponse);

      log.debug("Fetched users index: ", users);

      return { users };
    },
  });
}

/**
 * # Update User
 *
 * A mutation hook for updating a user with Tanstack Query
 *
 * @returns
 */
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedUser: UpdateUserParams) => {
      const usersService = await UsersService.getInstance();
      return usersService.update(updatedUser);
    },
    onSuccess: (data, variables) => {
      // Update the user in the cache
      queryClient.setQueryData([USERS.all, variables.id], data);

      // Invalidate the user list query
      queryClient.invalidateQueries({
        queryKey: [USERS.all],
      });

      log.debug("User updated successfully", { userID: variables.id });
    },
    onError: (error: Error, variables) => {
      log.error("Failed to update user: ", {
        error,
        userId: variables.id,
      });
    },
  });
}

/**
 * # Delete User
 *
 * A mutation hook for deleting a user with TanStack Query
 *
 */
export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const usersService = await UsersService.getInstance();
      return usersService.delete(userId);
    },
    onSuccess: (_, userId) => {
      // Remove the user from the cache
      queryClient.removeQueries({
        queryKey: [USERS.all, userId],
      });

      // Invalidate the users list query to refetch
      queryClient.invalidateQueries({
        queryKey: [USERS.all],
      });

      log.debug("User deleted successfully", { userId });
    },
    onError: (error: Error, userId) => {
      log.error("Failed to delete user:", {
        error,
        userId,
      });
    },
  });
}
