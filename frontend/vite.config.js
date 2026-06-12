// Vite build configuration — uses the official React plugin for JSX transform and HMR
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
