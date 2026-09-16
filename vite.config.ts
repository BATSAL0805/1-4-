import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the project from /<repo-name>/, so assets must use
  // relative paths instead of absolute ones.
  base: './',
})
