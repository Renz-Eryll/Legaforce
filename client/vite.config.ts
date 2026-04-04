import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Chunk splitting for faster initial loads on Vercel
    rollupOptions: {
      output: {
        manualChunks: {
          // Heavy libs in separate chunks (cached independently by CDN)
          vendor: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
          ui: ["framer-motion", "lucide-react"],
          state: ["zustand", "@tanstack/react-query", "axios"],
        },
      },
    },
    // Smaller chunk size warnings
    chunkSizeWarningLimit: 500,
    // Minify with esbuild (default, fastest)
    target: "es2020",
    sourcemap: false,
  },
}));
