import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { devtools } from '@tanstack/devtools-vite';

export default defineConfig(() => ({
  plugins: [
    devtools(),
    tsConfigPaths(
      {
        projects: ["./tsconfig.json"],
      }
    ),
    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
})
);
