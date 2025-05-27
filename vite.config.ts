import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig(async () => {
  const mdx = await import('@mdx-js/rollup')
  return {
    plugins: [
      TanStackRouterVite({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: 'src/app/routes',
        generatedRouteTree: 'src/shared/utils/router/routeTree.gen.ts',
        routeFileIgnorePrefix: '-',
      }),
      react(),
      tailwindcss(),
      tsconfigPaths(),
      mdx.default(),
    ],
    build: {
      rollupOptions: {
        input: 'src/app/main.tsx',
      },
    },
  }
})
