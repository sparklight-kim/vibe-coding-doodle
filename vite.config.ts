import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import rehypePrism from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig(async () => {
  const mdx = await import('@mdx-js/rollup')
  const remarkGfm = await import('remark-gfm')
  const remarkFrontmatter = await import('remark-frontmatter')
  const remarkMdxFrontmatter = await import('remark-mdx-frontmatter')

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
      tsconfigPaths(),
      mdx.default({
        remarkPlugins: [
          remarkGfm.default,
          remarkFrontmatter.default,
          remarkMdxFrontmatter.default
        ],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrism, {
            showLineNumbers: true,
            ignoreMissing: true,
          }],
        ],
      }),
    ],
    define: {
      global: 'globalThis',
    },
    resolve: {
      alias: {
        buffer: 'buffer',
      },
    },
    optimizeDeps: {
      include: ['buffer'],
    },
    build: {
      rollupOptions: {
        input: 'src/app/main.tsx',
      },
    },
  }
})
