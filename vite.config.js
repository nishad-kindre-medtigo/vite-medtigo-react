import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001
  },
  esbuild: {
    loader: "jsx",
    include: /\.jsx?$/, // This tells Vite to process JSX in .js files too
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src")
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
});
