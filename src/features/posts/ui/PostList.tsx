import { Link } from '@tanstack/react-router'
import type { Post } from '../../../entities/post/types'

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <div className="text-gray-500 dark:text-gray-400 text-center py-12">포스트가 없습니다.</div>
  }
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article key={post.slug} className="rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <Link to="/posts/$slug" params={{ slug: post.slug }} className="block hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400">{post.frontmatter.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{post.frontmatter.description}</p>
            <div className="flex items-center justify-between">
              <time className="text-sm text-gray-500 dark:text-gray-400">{new Date(post.frontmatter.date).toLocaleDateString('ko-KR')}</time>
              <div className="flex flex-wrap gap-2">
                {post.frontmatter.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
} 