import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // One .env for the whole project lives in the repo root.
  envDir: "..",
});
