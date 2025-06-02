import { createRootRoute, HeadContent, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { DarkModeToggle } from '@/shared/components/ui/DarkModeToggle'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        title: 'My Blog',
      },
      {
        name: 'description',
        content: 'A personal blog about technology, programming, and development',
      },
      {
        name: 'keywords',
        content: 'blog, technology, programming, development, react, typescript',
      },
      {
        name: 'author',
        content: 'Blog Author',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: 'My Blog',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'canonical',
        href: 'https://myblog.com',
      },
    ],
  }),
  component: () => (
    <>
      <HeadContent />
      <nav className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 md:px-8 py-3">
          <div className="flex gap-4">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium" activeProps={{ className: 'text-blue-800 font-bold' }}>홈</Link>
            <Link to="/posts" className="text-blue-600 hover:text-blue-800 font-medium" activeProps={{ className: 'text-blue-800 font-bold' }}>포스트</Link>
            <Link to="/tags" className="text-blue-600 hover:text-blue-800 font-medium" activeProps={{ className: 'text-blue-800 font-bold' }}>태그</Link>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
          </div>
        </div>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})