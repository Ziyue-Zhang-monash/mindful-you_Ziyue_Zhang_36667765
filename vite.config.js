import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite uses the Vue plugin to compile Vue single-file components.
export default defineConfig({
  plugins: [vue()]
})
