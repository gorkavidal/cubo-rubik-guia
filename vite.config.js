import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relativa → el build es portable (Vercel, subcarpetas o abierto en local).
export default defineConfig({
  plugins: [react()],
  base: "./",
});
