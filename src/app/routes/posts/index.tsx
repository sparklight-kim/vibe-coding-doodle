import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/')({
  component: PostsIndex,
})

// Vite의 glob import를 사용하여 모든 MDX 파일의 메타데이터를 가져옵니다
const postModules = import.meta.glob('../../../content/posts/*.mdx', { eager: false })

function PostsIndex() {
  // MDX 파일 경로에서 slug를 추출하고 포스트 목록을 생성합니다
  const posts = Object.keys(postModules)
    .filter(path => !path.includes('not-found.mdx')) // not-found 파일은 제외
    .map(path => {
      const slug = path.split('/').pop()?.replace('.mdx', '') || ''
      
      // 실제 프로덕션에서는 MDX 파일의 frontmatter에서 메타데이터를 읽어와야 합니다
      // 지금은 파일명을 기반으로 간단한 메타데이터를 생성합니다
      return {
        slug,
        title: slug.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        description: `${slug}에 대한 포스트입니다.`,
        date: '2024-01-15', // 실제로는 파일의 생성/수정 날짜를 사용해야 합니다
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div>
      <div className="grid gap-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">
              <Link
                to="/posts/$slug"
                params={{ slug: post.slug }}
                className="text-blue-600 hover:text-blue-800"
              >
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-3">{post.description}</p>
            <time className="text-sm text-gray-500">{post.date}</time>
          </article>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">아직 포스트가 없습니다.</p>
        </div>
      )}
    </div>
  )
} 