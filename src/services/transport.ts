//-- ./src/services/transport.ts

// /// Grpc Client Code

import { configuration } from "@/configuration";
import {
  GrpcWebFetchTransport,
  type GrpcWebOptions,
} from "@protobuf-ts/grpcweb-transport";

// import {
//   GrpcWebFetchTransport,
//   GrpcWebOptions,
// } from "@protobuf-ts/grpcweb-transport";

// const RPC_URL = "http://127.0.0.1:8081";

// export default function useRPCTransport() {
//   const options: GrpcWebOptions = {
//     baseUrl: RPC_URL,
//     format: "binary",
//     timeout: 2 * 1000,
//   };
//   return new GrpcWebFetchTransport(options);
// }

/**
 * ### Grpc Transport Options
 */
export interface GrpcTransportOptions extends GrpcWebOptions {
  baseUrl: string;
  // Add other transport options here, such as credentials, headers, etc.
}

/**
 * ### Grpc Transport
 */
export interface GrpcTransport {
  transport: GrpcWebFetchTransport;
}

/**
 * ### Create Grpc Transport
 *
 * @param {GrpcTransportOptions} options
 * @returns {GrpcWebFetchTransport}
 */
export function createGrpcTransport(
  options: GrpcTransportOptions
): GrpcWebFetchTransport {
  return new GrpcWebFetchTransport(options);
}

export function getGrpcTransport() {
  const transport = createGrpcTransport({
    baseUrl: configuration.AUTHENTICATION_BASE_URL,
  });

  return transport;
}
