import { MDXProvider } from '@mdx-js/react'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy, useEffect, useState } from 'react'
import { PostHeader } from '../../../features/posts/ui/PostHeader'
import { PostToc } from '../../../features/posts/ui/PostToc'
import { CodeBlock } from '../../../shared/components/ui/CodeBlock'
import { extractTocFromMdx, parseMDXContent, type PostFrontmatter, type TocItem } from '../../../shared/utils/mdx'

export const Route = createFileRoute('/posts/$slug')({
  head: ({ params }) => ({
    meta: [
      {
        title: `Post ${params.slug} - My Blog`,
      },
      {
        name: 'description',
        content: 'Blog post content.',
      },
      {
        property: 'og:title',
        content: `Post ${params.slug} - My Blog`,
      },
      {
        property: 'og:type',
        content: 'article',
      },
      {
        property: 'og:url',
        content: `https://myblog.com/posts/${params.slug}`,
      },
    ],
  }),
  component: PostPage,
})

// Vite의 glob import를 사용하여 모든 MDX 파일을 미리 로드합니다
const posts = import.meta.glob('../../../content/posts/*.mdx', { eager: false })
const postsRaw = import.meta.glob('../../../content/posts/*.mdx', { 
  eager: false,
  query: '?raw',
  import: 'default'
})

function PostPage() {
  const { slug } = Route.useParams()
  const [frontmatter, setFrontmatter] = useState<PostFrontmatter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toc, setToc] = useState<TocItem[]>([])
  
  useEffect(() => {
    async function loadFrontmatter() {
      try {
        const postPath = `../../../content/posts/${slug}.mdx`
        if (postsRaw[postPath]) {
          const content = await postsRaw[postPath]() as string
          const parseResult = parseMDXContent(content)
          
          if (!parseResult.success) {
            console.warn(`포스트 파싱 실패 (${slug}):`, parseResult.error)
            setError(parseResult.error)
            
            // 파싱 실패 시 기본값 사용 (부분적 데이터가 있다면)
            if (parseResult.data?.frontmatter) {
              setFrontmatter(parseResult.data.frontmatter)
            } else {
              setFrontmatter(null)
            }
            return
          }
          
          // published가 false인 포스트는 접근 불가
          if (!parseResult.data.frontmatter.published) {
            setFrontmatter(null)
          } else {
            setFrontmatter(parseResult.data.frontmatter)
          }
        } else {
          setFrontmatter(null)
        }
      } catch (error) {
        console.error('Failed to load frontmatter:', error)
        setError(`포스트 로딩 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
        setFrontmatter(null)
      } finally {
        setLoading(false)
      }
    }

    loadFrontmatter()
  }, [slug])
  
  useEffect(() => {
    async function loadToc() {
      const postPath = `../../../content/posts/${slug}.mdx`
      if (postsRaw[postPath]) {
        const content = await postsRaw[postPath]() as string
        const mdxContent = parseMDXContent(content).data?.content || ''
        setToc(extractTocFromMdx(mdxContent))
      }
    }
    loadToc()
  }, [slug])
  
  // 해당 slug에 맞는 MDX 파일을 찾습니다
  const postPath = `../../../content/posts/${slug}.mdx`
  const PostContent = lazy(() => {
    if (posts[postPath] && frontmatter?.published !== false) {
      return posts[postPath]() as Promise<{ default: React.ComponentType }>
    }
    // 파일이 없거나 published가 false면 not-found 페이지를 보여줍니다
    return posts['../../../content/posts/not-found.mdx']() as Promise<{ default: React.ComponentType }>
  })

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <article className="max-w-4xl mx-auto px-4 md:px-8 pb-20 md:pr-80 text-gray-900 dark:prose-invert">
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg not-prose">
            <h3 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">⚠️ 포스트 로딩 중 오류 발생</h3>
            <p className="text-yellow-700 dark:text-yellow-100 text-sm">{error}</p>
          </div>
        )}
        {frontmatter && (
          <PostHeader frontmatter={{
            ...frontmatter,
            description: frontmatter.description || '',
            updatedAt: frontmatter.updatedAt || '',
          }} />
        )}
        <MDXProvider components={{ pre: CodeBlock }}>
          <Suspense fallback={<div className="animate-pulse">컨텐츠 로딩 중...</div>}>
            <PostContent />
          </Suspense>
        </MDXProvider>
      </article>
      <PostToc toc={toc} />
    </div>
  )
} 