// app.config.ts
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
var app_config_default = defineConfig({
  vite: {
    plugins: [
      // @ts-ignore
      tsConfigPaths({
        projects: ["./tsconfig.json"]
      }),
      tailwindcss()
    ]
  },
  server: {
    preset: "netlify"
  }
});
export {
  app_config_default as default
};
