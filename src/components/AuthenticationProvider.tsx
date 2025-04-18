//-- ./src/components/AccessTokenProvider.tsx

/**
 * # Access Token Provider
 * 
 * Application wide access token provider.
 * 
 * ## Getting Started
 * 
 * The React app needs to be wrapped in a `<AuthenticationProvider>`. To make the 
 * Authentication Provider available to the Tanstack Router Context, it needs to
 * passed into the <`RouterProvider>` context and the `__root` route created with
 * context `<MyRouterContext>`.
 * 
 * The Authentication Provider can then be accessed within a component using the following
 * `const { accessToken, currentUser, handleLogin, handleLogout, } = useAuthentication();` 
 * 
 * ## References
 * 
 * - [](https://github.com/cosdensolutions/code/blob/master/videos/long/role-based-authentication-in-react/src/components/AuthProvider.tsx)
 */

import type { User } from "@/domains/user";
import Logger from "@/logger";
import {
  sendLoginRequest,
  sendLogoutRequest,
  sendRefreshRequest,
} from "@/services/authentication";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const log = Logger.getInstance();

// TODO: move to domain to separate concerns
type Authentication = {
  accessToken?: string | null;
  currentUser?: User | null;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AUTHENTICATION_ERRORS = {
  INVALID_LOGIN: "Login request failed.",
  INVALID_REFRESH: "refresh of access token failed.",
  CONTEXT_ERROR: "useAuth must be used inside of a AuthProvider",
  INVALID_LOGOUT: "Logout request failed."
} as const;

const AuthenticationContext = createContext<Authentication | undefined>(undefined);


type AuthenticationProviderProps = PropsWithChildren;

/**
 * # Access Token Provider
 * 
 * Provide access token and user state globally.
 * 
 * @param param0 
 * @returns 
 */
export default function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>();
  const [currentUser, setCurrentUser] = useState<User | null>();

  useEffect(() => {
    /**
     * # Refresh Access Token
     * 
     * This function relies on the browser sending the http-only cookie to the 
     * authentication service. 
     */
    async function refreshAccessToken() {
      // TODO: can we add currentUser here and in the dependency array?
      log.info("Attempting to refresh the access token.");
      try {
        const response = await sendRefreshRequest();

        // Throw error if response does not contain an access token or user
        // Protobuf V3 magically assigns types to optional, so check for undefined user
        if (!response.accessToken || response.user === undefined) {
          throw new Error(AUTHENTICATION_ERRORS.INVALID_LOGIN);
        }

        // Convert user response to a domain user. You can not cast Typescript types.
        // If block above checks for undefined case
        const currentUser: User = {
          id: response.user.id,
          email: response.user.email,
          role: response.user.role,
        };

        setAccessToken(response.accessToken);
        setCurrentUser(currentUser);

        log.info("Access token and current user set in state.")
      } catch (error) {
        log.error("Login refresh failed:", error);
        setAccessToken(null);
        setCurrentUser(null);
        throw error;
      }
    }

    //TODO: Handle te promise rejection
    refreshAccessToken();
  }, []);

  // TODO: Do we need the token expiration code below?
  // useEffect(() => {
  //   if (!refreshToken) return;

  //   const refreshInterval = setInterval(() => {
  //     refreshLogin().catch((error) => {
  //       log.error("Auto refresh failed:", error);
  //     });
  //   }, TOKEN_REFRESH_INTERVAL);

  //   return () => clearInterval(refreshInterval);
  // }, [refreshToken]);

  /**
   * # Handle Login
   * 
   * A handle function to log a user into the authentication service.
   * 
   * This function sends a login request that returns a response that contains
   * the access token to use with grpc requests and the current user instance.
   * 
   * The access token and current user is then added to the provider (global) state
   * for access through out the app.
   * 
   * @param email 
   * @param password 
   */
  async function handleLogin(email: string, password: string) {
    log.info("handleLogin: Attempting login for user:", email);

    try {
      const response = await sendLoginRequest(email, password);

      // Throw error if response does not contain an access token or user
      // Protobuf V3 magically assigns types to optional, so check for undefined user
      if (!response.accessToken || response.user === undefined) {
        throw new Error(AUTHENTICATION_ERRORS.INVALID_LOGIN);
      }

      // Convert user response to a domain user. You can not cast Typescript types.
      // If block above checks for undefined case
      const currentUser: User = {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
      };

      setAccessToken(response.accessToken);
      setCurrentUser(currentUser);

      log.info("Login request successful for user: ", currentUser.email);
    } catch (error) {
      log.error("Login request failed:", error);
      setAccessToken(null);
      setCurrentUser(null);
      throw error;
    }
  }

  /**
   * # Handle Logout Request
   * 
   * This function attempts to logout from the authentication service. If successful
   * it sets the access token and current user to null. Else it throws an error
   */
  async function handleLogout() {
    log.info("Logging out user: ", currentUser?.email);

    try {
      const response = await sendLogoutRequest();

      if (!response.success) {
        throw new Error(AUTHENTICATION_ERRORS.INVALID_LOGOUT);
      }

      log.info("Logout successful for user: {}", currentUser?.email);

      setAccessToken(null);
      setCurrentUser(null);

    } catch (error) {
      log.error("Logout request failed:", error);
      throw error;
    }
  }

  return (
    <AuthenticationContext.Provider
      value={{
        accessToken,
        currentUser,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthentication() {
  const context = useContext(AuthenticationContext);

  if (context === undefined) {
    throw new Error(AUTHENTICATION_ERRORS.CONTEXT_ERROR);
  }

  return context;
}

// TODO: Add unit test for:
// 1. [ ] Add unit tests for the authentication flow
// 2. [ ] Add integration tests for the token refresh mechanism
// 3. [ ] Test error scenarios
// 4. [ ] Test the context provider
// 5. [ ] Test the useAuth hook