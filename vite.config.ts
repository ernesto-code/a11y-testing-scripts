import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // build: {
  // emptyOutDir: true,
  // rollupOptions: {
  // input: ['index.html', 'src/utils/background.tsx'],
  // input: {
  //   index: 'index.html',
  //   background: 'src/utils/background.tsx',
  //   manifest: 'src/manifest.json'
  // },
  // output: {
  // entryFileNames: "assets/[name].js",
  // chunkFileNames: "assets/[name].js",
  // assetFileNames: "assets/[name].[ext]",
  // },
  // },
  // polyfillModulePreload: false,
  // minify: false,
  // },
})
