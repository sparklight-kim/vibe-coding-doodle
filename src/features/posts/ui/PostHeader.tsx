import type { PostFrontmatter } from '../../../entities/post/types'

interface PostHeaderProps {
  frontmatter: PostFrontmatter
}

export function PostHeader({ frontmatter }: PostHeaderProps) {
  return (
    <header className="mb-8 pb-8 border-b">
      <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>
      {frontmatter.description && (
        <p className="text-xl  text-gray-600 dark:text-gray-300 mb-4">{frontmatter.description}</p>
      )}
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <time>작성일: {frontmatter.date}</time>
        {frontmatter.updatedAt && (
          <time>수정일: {frontmatter.updatedAt}</time>
        )}
      </div>
      {frontmatter.tags && Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  )
} 