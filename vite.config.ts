import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const port = Number.parseInt(
  process.env.PORT || process.env.VITE_PORT || "8080",
  10
);

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port,
    strictPort: true
  },
  preview: {
    host: true,
    port,
    strictPort: true
  }
});
