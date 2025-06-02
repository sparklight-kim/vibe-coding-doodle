import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { PostList } from '../../../features/posts/ui/PostList'
import { getPostSlugFromPath, parseMDXContent, type PostData } from '../../../shared/utils/mdx'

const PAGE_SIZE = 10

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
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function loadPosts() {
      try {
        const postPromises = Object.entries(postModules)
          .map(async ([path, mod]) => {
            const slug = getPostSlugFromPath(path)
            const raw = (await (mod as any)()) as string
            const parsed = await parseMDXContent(raw)
            if (!parsed.success) return null
            if (!parsed.data.frontmatter.published) return null
            return {
              slug,
              frontmatter: {
                ...parsed.data.frontmatter,
                description: parsed.data.frontmatter.description || '',
                updatedAt: parsed.data.frontmatter.updatedAt || '',
              },
              content: '',
            }
          })
        const loaded = (await Promise.all(postPromises)).filter(Boolean) as PostData[]
        // 날짜 내림차순 정렬
        loaded.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
        setPosts(loaded)
      } catch (e) {
        setErrors([String(e)])
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [])

  // 페이지네이션
  const total = posts.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const pagedPosts = useMemo(() => posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [posts, page])

  // Post 타입 변환 (description, updatedAt string 보장)
  const postListData = pagedPosts.map(post => ({
    ...post,
    frontmatter: {
      ...post.frontmatter,
      description: post.frontmatter.description || '',
      updatedAt: post.frontmatter.updatedAt || '',
    },
  }))

  // 페이지 이동
  const goPage = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)))

  // 페이지네이션 번호 계산
  const getPageNumbers = () => {
    let start = Math.max(1, page - 2)
    let end = Math.min(totalPages, start + 4)
    if (end - start < 4) start = Math.max(1, end - 4)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  if (loading) return <div className="container mx-auto px-4 md:px-8 py-8">로딩 중...</div>
  if (errors.length > 0) return <div className="container mx-auto px-4 md:px-8 py-8 text-red-500">{errors.join(', ')}</div>

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">포스트</h1>
      <PostList posts={postListData} />
      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-2 mt-8">
        <button onClick={() => goPage(1)} disabled={page === 1} className="px-2 py-1">{'<<'}</button>
        <button onClick={() => goPage(page - 1)} disabled={page === 1} className="px-2 py-1">{'<'}</button>
        {getPageNumbers().map(n => (
          <button key={n} onClick={() => goPage(n)} className={`px-3 py-1 rounded ${n === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{n}</button>
        ))}
        <button onClick={() => goPage(page + 1)} disabled={page === totalPages} className="px-2 py-1">{'>'}</button>
        <button onClick={() => goPage(totalPages)} disabled={page === totalPages} className="px-2 py-1">{'>>'}</button>
        <span className="ml-4">/</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={page}
          onChange={e => goPage(Number(e.target.value))}
          className="w-16 px-2 py-1 border rounded ml-2"
        />
        <span className="ml-2">페이지</span>
      </div>
    </div>
  )
} 