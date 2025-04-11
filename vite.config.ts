//-- vite.config.ts

// # Vite Configuration
//
// This file is used to configure Vite, a build tool that focuses on speed and performance.

import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path, { resolve } from "path";
import { exec } from "child_process";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// # Protocol Buffers Compiler Plugin
// This plugin watches for changes in .proto files and rebuilds them using the protoc compiler
function protocBuild(): Plugin {
  return {
    name: "protoc-build",
    // This hook is called when the Vite server starts
    // an us used to watch for changes in .proto files
    async buildStart() {
      // Adjust if your proto files are elsewhere
      const protoDir = resolve(__dirname, "protos/authentication");
      // Specify the proto files to watch and build from
      const protoFiles = `${protoDir}/*.proto`;

      this.addWatchFile(protoFiles);
    },
    // This hook is called when a watch file changes. It checks if the changed file is a .proto file. If it is, it rebuilds the protos using the protoc compiler.
    async handleHotUpdate({ file, server }) {
      if (file.endsWith(".proto")) {
        console.log(`Proto file changed: ${file}. Rebuilding...`);

        // Adjust if your proto files are elsewhere
        const protoDir = resolve(__dirname, "protos/authentication");
        // Adjust if your output directory is elsewhere
        const outputDir = resolve(__dirname, "src/lib/grpc");
        // Specify the proto files to watch and build from
        const protoFiles = `${protoDir}/*.proto`;

        // Command to run the protoc compiler
        // "build:proto": "npx protoc --ts_out src/lib/grpc -I=./protos/authentication --proto_path ./protos/authentication/**/*.proto --experimental_allow_proto3_optional",
        const command = `npx protoc --ts_out ${outputDir} -I=${protoDir} --experimental_allow_proto3_optional ${protoFiles}`;

        try {
          await new Promise<void>((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error rebuilding protos: ${error}`);
                console.error(`stderr: ${stderr}`);
                reject(error);
              } else {
                console.log(`Rebuilt protos:\n${stdout}`);
                resolve();
              }
            });
          });
          console.log("Successfully rebuilt protos");
        } catch (error) {
          console.error("Failed to rebuild protos:", error);
        }
        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      }
    },
  };
}

// # Vite Configuration
//
// This function imports the necessary modules and plugins to run a Vite project.
//
// https://vite.dev/config/
export default defineConfig({
  envDir: "./config",
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    protocBuild(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    // This allows you to use absolute imports in your vite project
    // For example, instead of importing from "../../components/MyComponent",
    // you can import from "@/components/MyComponent"
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
