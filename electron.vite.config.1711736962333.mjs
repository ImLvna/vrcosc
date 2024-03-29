// electron.vite.config.ts
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    plugins: [svelte()],
  },
});
export { electron_vite_config_default as default };
