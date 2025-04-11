//-- ./src/logger.ts

/**
 * # Custom Logger
 *
 * This module defines a custom logger object with five logging methods:
 *  1. trace
 *  2. debug
 *  3. info
 *  4. warn
 *  5. error
 *
 * Each method logs a message with a timestamp. The log level is determined by
 * the application mode.
 *
 * Note: Firefox does not support the "pretty" log type. The log type will default.
 * Check out [this issue](https://github.com/fullstack-build/tslog/issues/262) for more information.
 * Chrome and Edge support the "pretty" log type.
 *
 * ## References
 *
 * - [Github - nextcloud-node-client](https://github.com/hobigo/nextcloud-node-client/blob/master/src/logger.ts)
 * - [Github - tslog](https://github.com/fullstack-build/tslog/blob/master/src/index.ts
 * - [Github - koenemans/community-platform](https://github.com/koenemans/community-platform/blob/master/src/logger/index.ts)
 * -[Github - bda-research/node-crawler](https://github.com/bda-research/node-crawler/blob/master/src/logger.ts
 */

import {
  ILogObj as TSLogObj,
  ILogObjMeta as TSLogObjMeta,
  Logger as TSLogger,
} from "tslog";
import { configuration } from "./configuration";

/**
 * ### Log Level Mapping
 *
 * TSLog uses numbers to represent log levels. Define the log levels and their
 * corresponding numbers. The log level is determined by the LOG_LEVEL environment
 * variable. The default log level is "error".
 */
const levelNumberToNameMap = {
  silly: 0,
  trace: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5,
  fatal: 6,
};

/**
 * ### Application Log Level
 *
 * Get the log level from the application configuration
 */
const logLevel = configuration.LOG_LEVEL;

/**
 * ### Log Options
 *
 * Define the log options for the TSLog object. The log name is "Personal Ledger".
 * The log type is "pretty". The log level is determined by the logLevel variable.
 */
const logOptions: TSLogObj = {
  name: "Personal Ledger",
  type: "pretty",
  minLevel: levelNumberToNameMap[logLevel],
  hideLogPositionForProduction: true,
  prettyLogTemplate: "{{logLevelName}} - ", // https://tslog.js.org/#/?id=pretty-templates-and-styles-color-settings
  prettyLogStyles: {
    logLevelName: {
      SILLY: ["bold", "white"],
      TRACE: ["bold", "whiteBright"],
      DEBUG: ["bold", "green"],
      INFO: ["bold", "blue"],
      WARN: ["bold", "yellow"],
      ERROR: ["bold", "red"],
      FATAL: ["bold", "redBright"],
    },
    name: ["bold", "green"],
    dateIsoStr: "white",
    filePathWithLine: "white",
    nameWithDelimiterPrefix: ["white", "bold"],
    nameWithDelimiterSuffix: ["white", "bold"],
    errorName: ["bold", "bgRedBright", "whiteBright"],
    fileName: ["yellow"],
  },
};

/**
 *
 */
export default class Logger {
  /**
   * ### TSLogger Instance
   */
  private logger: TSLogger<TSLogObj>;

  public constructor() {
    // Construct a new TS logger instance
    this.logger = new TSLogger(logOptions);

    // overload is required to get the real position for logging
    this.silly = this.logger.silly.bind(this.logger);
    this.trace = this.logger.trace.bind(this.logger);
    this.debug = this.logger.debug.bind(this.logger);
    this.info = this.logger.info.bind(this.logger);
    this.warn = this.logger.warn.bind(this.logger);
    this.error = this.logger.error.bind(this.logger);
    this.fatal = this.logger.fatal.bind(this.logger);
  }

  /**
   * Logs a silly message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public silly(...args: unknown[]): (TSLogObj & TSLogObjMeta) | undefined {
    return this.logger.silly(...args);
  }

  /**
   * Logs a trace message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public trace(...args: unknown[]): (TSLogObj & TSLogObjMeta) | undefined {
    return this.logger.trace(...args);
  }

  /**
   * Logs a debug message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public debug(...args: unknown[]): (TSLogObj & TSLogObjMeta) | undefined {
    return this.logger.debug(...args);
  }

  /**
   * Logs an info message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public info(...args: unknown[]): (TSLogObj & TSLogObjMeta) | undefined {
    return this.logger.info(...args);
  }

  /**
   * Logs a warn message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public warn(...args: unknown[]): (TSLogObj & TSLogObjMeta) | undefined {
    return this.logger.warn(...args);
  }

  /**
   * Logs an error message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public error(...args: unknown[]): (TSLogObj & TSLogObjMeta) | undefined {
    return this.logger.error(...args);
  }

  /**
   * Logs a fatal message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public fatal(...args: unknown[]): (TSLogObj & TSLogObjMeta) | undefined {
    return this.logger.fatal(...args);
  }
}
