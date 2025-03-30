import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделение зависимостей
          react: ["react", "react-dom"],
          konva: ["konva", "react-konva"],
        },
      },
    },
  },
});
