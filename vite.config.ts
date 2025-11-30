import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { devtools } from '@tanstack/devtools-vite';
import netlify from '@netlify/vite-plugin-tanstack-start';


const config = defineConfig({
  plugins: [
    devtools(),
  tsConfigPaths(
      {
        projects: ["./tsconfig.json"],
      }
    ),
    tanstackStart(),
    netlify(),
    viteReact(), 
    tailwindcss(),
  ],
})

export default config;