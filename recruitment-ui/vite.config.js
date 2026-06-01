import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Jika Anda pakai plugin vite tailwind v4

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Pastikan ini ada jika menggunakan Tailwind v4 Vite Plugin
  ],
})