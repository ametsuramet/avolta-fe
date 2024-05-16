import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "./src") },
      // {
      //   // Allow moment.js to be used as an ESM module
      //   find: /^moment$/,
      //   replacement: path.resolve(__dirname, "./node_modules/moment/moment.js"),
      // },
    ]

  },
  plugins: [react()],
})
