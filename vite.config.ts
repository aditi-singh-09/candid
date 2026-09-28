import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import path from "path";

export default defineConfig({
  plugins: [react(), wasm()],
  resolve: {
    alias: {
      "isomorphic-ws": path.resolve(__dirname, "mock-ws.js"),
      "@midnight-ntwrk/bboard-contract": path.resolve(
        __dirname,
        "preprod-deployment/contracts/src/index.ts"
      ),
      "events": "events",
      "assert": "assert",
      "buffer": "buffer",
    },
  },
  build: {
    target: "esnext"
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
