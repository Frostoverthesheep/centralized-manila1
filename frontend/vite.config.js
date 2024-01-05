import { defineConfig } from 'vite'
import postcss from './postcss.config.js'
import react from '@vitejs/plugin-react'
import 'dotenv/config';


// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  define: {
    'process.env': process.env
  },
  css: {
    postcss,
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^~.+/,
        replacement: (val) => {
          return val.replace(/^~/, "");
        },
      },
    ],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  } 
})
