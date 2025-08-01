// electron-vite.config.ts 一模一样的副本
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@": resolve("src/renderer/src")
      }
    },
    plugins: [
      tanstackRouter({
        routesDirectory: "./src/renderer/src/routes",
        generatedRouteTree: "./src/renderer/src/routeTree.gen.ts"
      }),
      react(),
      tailwindcss()
    ]
  }
});
