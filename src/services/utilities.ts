//-- ./src/services/utilities.ts

/**
 * ## Utilities Service
 *
 * The utilities service is responsible for handling utility requests with the
 * application. The service provides a ping method that returns a response from
 * the backend.
 *
 * @packageDocumentation
 * @module services/utilities
 * @category Services
 * @subcategory Utilities
 *
 * ### References
 *
 * - [dnevb/dburst](https://github.com/dnevb/dburst/blob/a440b2a18f874f22fed2825b6e9b0e24cd606e73/ui/src/provider/services.ts)
 */

import { configuration } from "@/configuration";
import { Empty } from "@/lib/grpc/common";
import { PingResponse } from "@/lib/grpc/utilities";
import { UtilitiesServiceClient } from "@/lib/grpc/utilities.client";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import Logger from "@/logger";

/**
 * ## Logger Instance
 *
 * Create a new logger instance to log messages to the console.
 */
const log = Logger.getInstance();

// TODO: Needs a status or health check type/domain to replace PingResponse
export async function sendPintRequest(): Promise<PingResponse> {
  log.debug("Sending ping request to authentication server");

  // Create a new GRPC transport layer
  const transport = new GrpcWebFetchTransport({
    baseUrl: configuration.AUTHENTICATION_BASE_URL,
  });

  // Create a new utilities client
  const utilities_client = new UtilitiesServiceClient(transport);

  // Create a ping request
  const ping_request = Empty.create({});

  const { response: ping_response, status } =
    await utilities_client.ping(ping_request);

  log.debug("Authentication server status is:", status);

  return ping_response;
}
