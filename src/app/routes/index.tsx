import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'Home - My Blog',
      },
      {
        name: 'description',
        content: 'Welcome to my personal blog. Discover articles about technology, programming, and development.',
      },
      {
        property: 'og:title',
        content: 'Home - My Blog',
      },
      {
        property: 'og:description',
        content: 'Welcome to my personal blog. Discover articles about technology, programming, and development.',
      },
      {
        property: 'og:url',
        content: 'https://myblog.com',
      },
    ],
  }),
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <p>이곳은 기술, 프로그래밍, 개발에 관한 개인 블로그입니다.</p>
    </div>
  )
}