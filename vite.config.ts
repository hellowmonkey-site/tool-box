import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { join } from "path";
import { copySync, removeSync } from "fs-extra";
import electron from "vite-plugin-electron";

const isElectron = process.env.MODE === "electron";
const isDev = process.env.NODE_ENV === "development";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    isElectron
      ? {
          name: "init",
          buildStart() {
            removeSync(join(__dirname, "dist/electron"));
            copySync(join(__dirname, "electron/resource"), "dist/electron/resource");
            copySync(join(__dirname, "electron/data"), "dist/electron/data");
          },
        }
      : null,
    isElectron
      ? electron({
          main: {
            entry: "electron/main/index.ts",
            vite: {
              build: {
                outDir: "dist/electron/main",
                minify: false,
              },
            },
          },
          preload: {
            input: {
              index: join(__dirname, "electron/preload/index.ts"),
            },
            vite: {
              build: {
                sourcemap: "inline",
                outDir: "dist/electron/preload",
                minify: false,
              },
            },
          },
        })
      : null,
  ],
  server: {
    host: "0.0.0.0",
    port: 3030,
  },
  resolve: {
    alias: {
      "@": "/src",
      "~": "/node_modules",
    },
  },
  build: {
    outDir: "dist/build",
  },
});
