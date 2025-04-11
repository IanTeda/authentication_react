//-- ./src/configuration.ts

/**
 * # Configuration Class
 *
 * Configuration class for application settings of environment variables
 *
 * The configuration module is responsible for providing the application with
 * configuration settings. The configuration settings are loaded from the
 * environment variables in ./src/config.
 *
 * Add a new configuration setting by adding a new property to the Configuration
 * class and setting the value in the constructor.
 *
 * @class Configuration
 * @property {string} APPLICATION_MODE - Application mode for the environment (i.e. development or production.)
 * @property {string} BASE_URL - Base URL for the authentication service
 * @property {string} LOG_LEVEL - Log level for the application  *
 *
 * ## Reference
 *
 */

type logLevel =
  | "silly"
  | "trace"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "fatal";

/**
 * ### Application Configuration
 *
 * Configuration class for application settings of environment variables
 */
class Configuration {
  /**
   * ### Singleton Instance
   *
   * The singleton instance of the Configuration class.
   */
  private static instance: Configuration;

  /**
   * ### Application Mode
   *
   * Application mode for the environment (i.e. development or production.)
   *
   * #### Reference
   * - [Vite - Env Variables and Modes](https://vite.dev/guide/env-and-mode#node-env-and-modes)
   */
  APPLICATION_MODE: string;

  /**
   * ### Authentication Base URL
   *
   * The base URL for the authentication backend service
   *
   */
  BASE_URL: string;

  /**
   * ### Application Log Level
   *
   * To what level of detail should we log
   */
  LOG_LEVEL: logLevel;

  /**
   * ### Configuration Class Constructor
   */
  private constructor() {
    // Set the application mode to the value of import.meta.env.MODE
    // or default to development if not set.  This is used to set the
    // application mode for the environment (i.e. development or production.)
    this.APPLICATION_MODE = import.meta.env.MODE;

    // Set the authentication base URL to the value of
    // VITE_AUTHENTICATION_BASE_URL or default to localhost:8081 if not set.
    // This is used to set the base URL for the authentication service.
    if (!import.meta.env.VITE_BASE_URL) {
      console.warn(
        "VITE_AUTHENTICATION_BASE_URL is not set.  Using default value."
      );
      this.BASE_URL = "http://127.0.0.1:8081";
    } else {
      this.BASE_URL =
        import.meta.env.VITE_BASE_URL;
    }

    // Set the log level to the value of VITE_LOG_LEVEL or default to error
    // if not set.  This is used to set the log level for the application.
    this.LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || "error";
  }

  /**
   * ### Get Instance
   *
   * Get the singleton instance of the Configuration class.
   *
   * @returns {Configuration} The singleton instance of the Configuration class.
   */
  public static getInstance(): Configuration {
    if (!Configuration.instance) {
      Configuration.instance = new Configuration();
    }
    return Configuration.instance;
  }
}

/**
 * ## Application Configuration
 *
 * Configuration class for application settings of environment variables, which
 * includes the following values:
 *
 * - AUTHENTICATION_BASE_URL - Base URL for the authentication service
 * - APPLICATION_MODE - Application mode for the environment (i.e. development or production.)
 * - LOG_LEVEL - Log level for the application
 *
 */
export const configuration = Configuration.getInstance();