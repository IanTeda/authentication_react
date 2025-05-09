/**
 * # User Role
 *
 * User roles in the system.
 */
export enum Role {
  Admin = "admin",
  User = "user",
  Guest = "guest",
}

export type RoleType = `${Role}`;

/**
 * # Is Role
 * 
 * Check if a string is a valid Role.
 * 
 * @param value 
 * @returns 
 */
export function isRole(value: string): value is Role {
  return Object.values(Role).includes(value as Role);
}