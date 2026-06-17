import { defineConfig } from "vite";

export default defineConfig({
  server: {
    allowedHosts: [".csb.app"],
    host: "0.0.0.0",
    port: 5173,
  },
});
