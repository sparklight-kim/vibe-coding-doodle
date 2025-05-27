import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'

export const Route = createFileRoute('/posts/$slug')({
  component: PostPage,
})

// Vite의 glob import를 사용하여 모든 MDX 파일을 미리 로드합니다
const posts = import.meta.glob('../../../content/posts/*.mdx', { eager: false })

function PostPage() {
  const { slug } = Route.useParams()
  
  // 해당 slug에 맞는 MDX 파일을 찾습니다
  const postPath = `../../../content/posts/${slug}.mdx`
  const PostContent = lazy(() => {
    if (posts[postPath]) {
      return posts[postPath]() as Promise<{ default: React.ComponentType }>
    }
    // 파일이 없으면 not-found 페이지를 보여줍니다
    return posts['../../../content/posts/not-found.mdx']() as Promise<{ default: React.ComponentType }>
  })

  return (
    <article className="prose prose-lg max-w-none">
      <Suspense fallback={<div className="animate-pulse">로딩 중...</div>}>
        <PostContent />
      </Suspense>
    </article>
  )
} 