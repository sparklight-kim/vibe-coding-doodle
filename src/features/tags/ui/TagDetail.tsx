import { Link } from '@tanstack/react-router'
import type { Post } from '../../../entities/post/types'

interface TagDetailProps {
  tagName: string
  posts: Post[]
}

export function TagDetail({ tagName, posts }: TagDetailProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          to="/tags" 
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← 모든 태그 보기
        </Link>
        <h1 className="text-3xl font-bold mb-2">{tagName} 태그</h1>
        <p className="text-gray-600">{posts.length}개의 포스트</p>
      </div>
      
      <div className="space-y-6">
        {posts.map((post) => (
          <article 
            key={post.slug}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <Link 
              to="/posts/$postId"
              params={{ postId: post.slug }}
              className="block hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600">
                {post.frontmatter.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {post.frontmatter.description}
              </p>
              <div className="flex items-center justify-between">
                <time className="text-sm text-gray-500">
                  {new Date(post.frontmatter.date).toLocaleDateString('ko-KR')}
                </time>
                <div className="flex flex-wrap gap-2">
                  {post.frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 text-xs rounded-full ${
                        tag === tagName 
                          ? 'bg-blue-100 text-blue-800 font-medium' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            '{tagName}' 태그를 가진 포스트가 없습니다.
          </p>
        </div>
      )}
    </div>
  )
} 