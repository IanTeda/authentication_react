//-- ./src/services/utilities.ts

/**
 * # Utilities Service
 * 
 * This service is used to send ping requests to the backend. The service provides a ping method.
 */

import { Client } from "@/client";
import { Empty } from "@/lib/grpc/common";
import type { PingResponse } from "@/lib/grpc/utilities";
import Logger from "@/logger";

export class UtilitiesServiceError extends Error {
  constructor(
    message: string,
    public operation: "init" | "ping",
    public originalError?: unknown
  ) {
    super(message);
    this.name = "UtilitiesServiceError";
  }
}

const ERROR_MESSAGES = {
  INIT_FAILED: "Failed to initialize UtilitiesService",
  PING_FAILED: "Failed to send ping request",
} as const;

const GRPC_STATUS = {
  OK: "0",
  ERROR: "2",
} as const;

/**
 * # Utilities Service
 * 
 * This service is used to send ping requests to the backend. The service provides 
 * a ping method.
 * 
 * @class UtilitiesService
 * @description This service is used to send ping requests to the backend. The service provides a ping method.
 * @example
 * const utilitiesService = await UtilitiesService.getInstance();
 * const response = await utilitiesService.ping();
 * console.log(response);
 */
export class UtilitiesService {
  /**
   * # Logger Instance
   *
   * Create a new logger instance to log messages to the console.
   */
  private static log = Logger.getInstance();

  /**
   * The client to be used for making grpc requests
   *
   * @type {Client}
   */
  private utilitiesClient: ReturnType<Client["utilitiesClient"]>;

  /**
   * # Singleton Instance
   */
  private static instance: UtilitiesService;

  /**
   * # Constructor (new)
   *
   * @param client - The client to be used for making requests
   */
  private constructor(client: Client) {
    this.utilitiesClient = client.utilitiesClient();
  }

  /**
   * # Get Instance
   *
   * Get the singleton instance of the UtilitiesService
   *
   * @returns The singleton instance of UtilitiesService
   */
  public static async getInstance(): Promise<UtilitiesService> {
    if (!UtilitiesService.instance) {
      try {
        const client = await Client.new();
        UtilitiesService.instance = new UtilitiesService(client);
        this.log.info("UtilitiesService initialised successfully");
      } catch (error) {
        this.log.error("Service initialization failed", {
          error,
          service: "UtilitiesService",
        });
        throw new UtilitiesServiceError(
          ERROR_MESSAGES.INIT_FAILED,
          "init",
          error
        );
      }
    }
    return UtilitiesService.instance;
  }

  async ping(): Promise<PingResponse> {
    try {
      const requestMessage = Empty.create({});
      const { response, status } =
        await this.utilitiesClient.ping(requestMessage);

      // Check if the response is valid and status is OK (0)
      if (!response || status?.code !== GRPC_STATUS.OK) {
        throw new UtilitiesServiceError(
          ERROR_MESSAGES.PING_FAILED,
          "ping",
          new Error(`Invalid response: ${status?.detail || "Unknown error"}`)
        );
      }

      return response;
    } catch (error) {
      UtilitiesService.log.error("Ping request failed:", { error });
      throw new UtilitiesServiceError(
        ERROR_MESSAGES.PING_FAILED,
        "ping",
        error
      );
    }
  }
}