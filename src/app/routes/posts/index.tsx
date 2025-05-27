import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { formatDate, getPostSlugFromPath, parseMDXContent, type PostData } from '../../../shared/utils/mdx'

export const Route = createFileRoute('/posts/')({
  component: PostsIndex,
})

// Vite의 glob import를 사용하여 모든 MDX 파일의 메타데이터를 가져옵니다
const postModules = import.meta.glob('../../../content/posts/*.mdx', { 
  eager: false,
  query: '?raw',
  import: 'default'
})

function PostsIndex() {
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    async function loadPosts() {
      try {
        const postPromises = Object.entries(postModules)
          .filter(([path]) => !path.includes('not-found.mdx')) // not-found 파일은 제외
          .map(async ([path, loader]) => {
            const content = await loader() as string
            const parseResult = parseMDXContent(content)
            const slug = getPostSlugFromPath(path)
            
            if (!parseResult.success) {
              console.warn(`포스트 파싱 실패 (${slug}):`, parseResult.error)
              setErrors(prev => [...prev, `${slug}: ${parseResult.error}`])
              
              // 파싱 실패 시 기본값 사용 (부분적 데이터가 있다면)
              if (parseResult.data?.frontmatter) {
                return {
                  slug,
                  frontmatter: parseResult.data.frontmatter,
                  content: '', // 목록에서는 content가 필요없음
                }
              }
              return null
            }
            
            return {
              slug,
              frontmatter: parseResult.data.frontmatter,
              content: '', // 목록에서는 content가 필요없음
            }
          })

        const loadedPosts = (await Promise.all(postPromises))
          .filter((post): post is PostData => post !== null)
        
        // published가 true인 포스트만 필터링하고 날짜순으로 정렬
        const publishedPosts = loadedPosts
          .filter(post => post.frontmatter.published)
          .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
        
        setPosts(publishedPosts)
      } catch (error) {
        console.error('Failed to load posts:', error)
        setErrors(prev => [...prev, `전체 로딩 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`])
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">포스트를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div>
      {/* 에러 표시 */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-yellow-800 font-semibold mb-2">⚠️ 포스트 로딩 중 오류 발생</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

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
                {post.frontmatter.title}
              </Link>
            </h2>
            {post.frontmatter.description && (
              <p className="text-gray-600 mb-3">{post.frontmatter.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <time>{formatDate(post.frontmatter.date)}</time>
              {post.frontmatter.updatedAt && (
                <span>수정: {formatDate(post.frontmatter.updatedAt)}</span>
              )}
            </div>
            {post.frontmatter.tags && Array.isArray(post.frontmatter.tags) && post.frontmatter.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
      
      {posts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">게시된 포스트가 없습니다.</p>
        </div>
      )}
    </div>
  )
} 