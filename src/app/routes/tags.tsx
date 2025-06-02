import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { getAllPosts, getAllTags } from '../../entities/post/api'
import { PostList } from '../../features/tags/ui/PostList'
import { TagBadgeList } from '../../features/tags/ui/TagBadgeList'

const PAGE_SIZE = 10

export const Route = createFileRoute('/tags')({
  head: () => ({
    meta: [
      {
        title: '태그 - My Blog',
      },
      {
        name: 'description',
        content: '블로그의 모든 태그를 확인하고 관련 포스트를 찾아보세요.',
      },
      {
        name: 'keywords',
        content: '태그, 블로그, 포스트, 카테고리',
      },
    ],
  }),
  loader: async () => {
    const [tags, posts] = await Promise.all([
      getAllTags(),
      getAllPosts(),
    ])
    // 태그 이름만 추출 (알파벳 순)
    const tagNames = tags.map(t => t.name)
    // 태그별 개수
    const counts = Object.fromEntries(tags.map(t => [t.name, t.count]))
    // 날짜 내림차순 정렬
    posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
    return { tagNames, posts, counts }
  },
  component: TagsPage,
})

function TagsPage() {
  const { tagNames, posts, counts } = Route.useLoaderData()
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(1)

  // AND 연산 필터링
  const filteredPosts = useMemo(() => {
    if (selected.length === 0) return posts
    return posts.filter(post => selected.every(tag => post.frontmatter.tags.includes(tag)))
  }, [selected, posts])

  // 페이지네이션
  const total = filteredPosts.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const pagedPosts = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // 페이지 이동
  const goPage = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)))

  // 태그 선택/해제
  const handleToggle = (tag: string) => {
    setPage(1)
    setSelected(sel => sel.includes(tag) ? sel.filter(t => t !== tag) : [...sel, tag])
  }

  // 페이지네이션 번호 계산
  const getPageNumbers = () => {
    let start = Math.max(1, page - 2)
    let end = Math.min(totalPages, start + 4)
    if (end - start < 4) start = Math.max(1, end - 4)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">태그</h1>
      <TagBadgeList tags={tagNames} selected={selected} onToggle={handleToggle} counts={counts} />
      <PostList posts={pagedPosts} />
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