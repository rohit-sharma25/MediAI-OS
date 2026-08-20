import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/ used for something 
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
