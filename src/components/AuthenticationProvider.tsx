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

import { userFromUserResponse, type User } from "@/domains/user";
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

type Authentication = {
  /**
   * # Is Loading
   *
   * Used to track the state of the authentication request. Tanstack router does 
   * not reload after state change, so we need to manage loading state.
   */
  isLoading: boolean;

  /**
   * # Is Authenticated
   *
   * Helper variable to check if the user is authenticated. isAuthenticated will
   * be true if the Current User is `Undefined` or `Null`. `Undefined` means that 
   * the user has never logged in. `Null` means that the user has logged out or an
   * attempt to refresh the access token has failed.
   */
  isAuthenticated: boolean;

  /**
   * # Access Token
   *
   * The access token string used to authenticate request on the back end.
   *
   * The access token can be either `undefined`, `null` or `string`.
   */
  accessToken?: string | null;

  /**
   * # Current User
   *
   * The current authenticated user. Used through out the application.
   *
   * The current user can be either `undefined`, `null` or `User`.
   *
   *  - `undefined` - means that we have never tried to login.
   *  - `null` - means we have tried to login and failed or logged out.
   *  - `User` - means we have logged in and received a user instance.
   */
  currentUser?: User | null;

  /**
   * # Handle Login
   *
   * Request user login using an email and password.
   *
   * @param email
   * @param password
   * @returns
   */
  handleLogin: (email: string, password: string) => Promise<void>;

  /**
   * # Handle Logout
   *
   * Request user logout.
   *
   * @returns
   */
  handleLogout: () => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AUTHENTICATION_ERRORS = {
  INVALID_LOGIN: "Login request failed.",
  INVALID_REFRESH: "Refresh of access token failed.",
  CONTEXT_ERROR: "useAuth must be used inside of a AuthProvider",
  INVALID_LOGOUT: "Logout request failed.",
} as const;

const AuthenticationContext = createContext<Authentication | undefined>(
  undefined
);

type AuthenticationProviderProps = PropsWithChildren;

/**
 * # Access Token Provider
 *
 * Provide access token and user state globally.
 *
 * @param param0
 * @returns
 */
export default function AuthenticationProvider({
  children,
}: AuthenticationProviderProps) {
  // Authentication loading state
  const [isLoading, setIsLoading] = useState(true);

  // Access token used by the backend to verify authorisation.
  const [accessToken, setAccessToken] = useState<string | null>();

  // Current authenticated user
  const [currentUser, setCurrentUser] = useState<User | null>();

  // Is the user authenticated. `!!` is a double negation to convert the value 
  // to a boolean. `undefined` or `null` will be false, anything else will be true.
  const isAuthenticated = !!currentUser;

  useEffect(() => {
    /**
     * # Refresh Access Token
     *
     * This function relies on the browser sending the http-only cookie to the
     * authentication service.
     */
    async function refreshAccessToken() {
      log.info("Attempting to refresh the access token.");

      try {
        setIsLoading(true);

        const response = await sendRefreshRequest();

        // Throw error if response does not contain an access token or user
        // Protobuf V3 magically assigns types to optional, so check for undefined user
        if (!response.accessToken || response.user === undefined) {
          throw new Error(AUTHENTICATION_ERRORS.INVALID_LOGIN);
        }

        const user = userFromUserResponse(response.user);

        const { accessToken: token } = response;

        setAccessToken(token);
        setCurrentUser(user);
      } catch {
        log.error("Refresh access token failed!");

        setAccessToken(null);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    refreshAccessToken();
  }, []);

  // Log the change in current user state.
  // Remember: React state updates are batched and asynchronous, so logging 
  // immediately after setState will show the old value, not the new one.
  useEffect(() => {
    log.debug("Current user changed to:", currentUser);
  }, [currentUser]);

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
      setIsLoading(true);

      const response = await sendLoginRequest(email, password);

      // Throw error if response does not contain an access token or user
      // Protobuf V3 magically assigns types to optional, so check for undefined user
      if (!response.accessToken || response.user === undefined) {
        throw new Error(AUTHENTICATION_ERRORS.INVALID_LOGIN);
      }

      const currentUser = userFromUserResponse(response.user);

      setAccessToken(response.accessToken);
      setCurrentUser(currentUser);

      log.info("Login request successful for user: ", currentUser.email);
    } catch (error) {
      log.error("Login request failed:", error);
      setAccessToken(null);
      setCurrentUser(null);
      throw error;
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthenticationContext.Provider
      value={{
        isLoading,
        isAuthenticated,
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

// # Actions:
//
// - [ ] Add protection against async race condition
// - [ ] Add unit tests for the authentication flow
// - [ ] Add integration tests for the token refresh mechanism
// - [ ] Test error scenarios
// - [ ] Test the context provider
// - [ ] Test the useAuth hook
