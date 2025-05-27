import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/posts')({
  head: () => ({
    meta: [
      {
        title: 'Posts - My Blog',
      },
      {
        name: 'description',
        content: 'Browse all blog posts about technology, programming, React, TypeScript, and web development.',
      },
      {
        property: 'og:title',
        content: 'Posts - My Blog',
      },
      {
        property: 'og:description',
        content: 'Browse all blog posts about technology, programming, React, TypeScript, and web development.',
      },
      {
        property: 'og:url',
        content: 'https://myblog.com/posts',
      },
    ],
  }),
  component: PostsLayout,
})

function PostsLayout() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
        <p className="text-gray-600 mt-2">기술, 프로그래밍, 개발에 관한 모든 포스트를 확인하세요</p>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
} 