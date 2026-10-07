import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // One .env for the whole project lives in the repo root.
  envDir: "..",
  // The API only accepts requests from this address, so fail loudly if the
  // port is taken instead of quietly moving to another one.
  server: { port: 5173, strictPort: true },
});
