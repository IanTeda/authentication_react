import type { UserResponse } from "@/lib/grpc/users";
import { Role, type RoleType } from "./role";

/**
 * UUID type alias for clarity.
 */
export type UUID = string;

/**
 * User
 * 
 * Type representing a user in the system.
 */
export type User = {
  /**
   * The ID of the user
   * This is a UUIDv7 string of the user
   */
  id: UUID;

  /**
   * The email of the user
   */
  email: string;

  /**
   * The name of the user
   */
  name: string;

  /**
   * The role of the user
   */
  role: RoleType;

  /**
   * Whether the user is active
   */
  isActive: boolean;

  /**
   * Whether the user is verified
   */
  isVerified: boolean;

  /**
   * The date the user was created
   */
  createdOn: Date;
};

/**
 * # User From UserResponse
 * 
 * Maps a gRPC UserResponse to a domain User type.
 * @param rpc - The gRPC UserResponse object
 * @returns The mapped User domain object 
 */
export function userFromUserResponse(rpc: UserResponse): User {
  return {
    id: rpc.id,
    email: rpc.email,
    name: rpc.name,
    role: Object.values(Role).includes(rpc.role as Role)
      ? (rpc.role as RoleType)
      : Role.User,
    isActive: rpc.isActive,
    isVerified: rpc.isVerified,
    createdOn: rpc.createdOn ? new Date(rpc.createdOn) : new Date(0),
  };
}