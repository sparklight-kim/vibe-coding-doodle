import { createRootRoute, HeadContent, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

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
      <nav className="bg-gray-100 p-4 mb-8">
        <div className="container mx-auto flex gap-4">
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-800 font-medium"
            activeProps={{ className: 'text-blue-800 font-bold' }}
          >
            홈
          </Link>
          <Link 
            to="/posts" 
            className="text-blue-600 hover:text-blue-800 font-medium"
            activeProps={{ className: 'text-blue-800 font-bold' }}
          >
            포스트
          </Link>
        </div>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})