import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
// plugin proprio: serve o backend do Albert (POST /api/albert) no dev server
import { albertDevApi } from './server/albertVitePlugin.mjs'

export default defineConfig({
  plugins: [react(), albertDevApi()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
  },
})
