import { Link } from '@tanstack/react-router'
import type { TagInfo } from '../../../entities/post/types'

interface TagListProps {
  tags: TagInfo[]
}

export function TagList({ tags }: TagListProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">태그</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            to="/tags/$tagName"
            params={{ tagName: tag.name }}
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            data-testid="tag-item"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {tag.name}
              </h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {tag.count}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              {tag.count}개의 포스트
            </p>
          </Link>
        ))}
      </div>
      
      {tags.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">아직 태그가 없습니다.</p>
        </div>
      )}
    </div>
  )
} 