import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig(async () => {
  const mdx = await import('@mdx-js/rollup')
  
  return {
    plugins: [
      react(),
      tsconfigPaths(),
      mdx.default(),
    ],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
    },
  }
}) 