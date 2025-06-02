import type { PostFrontmatter } from '../../../entities/post/types'
import { css } from "styled-system/css"

interface PostHeaderProps {
  frontmatter: PostFrontmatter
}

export function PostHeader({ frontmatter }: PostHeaderProps) {
  return (
    <header className={css({ mb: 8, pb: 8, borderBottomWidth: '1px' })}>
      <h1 className={css({ fontSize: '4xl', fontWeight: 'bold', mb: 4 })}>{frontmatter.title}</h1>
      {frontmatter.description && (
        <p className={css({ fontSize: 'xl', color: { base: 'gray.600', _dark: 'gray.300' }, mb: 4 })}>{frontmatter.description}</p>
      )}
      <div className={css({ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'sm', color: { base: 'gray.500', _dark: 'gray.400' }, mb: 2 })}>
        <time>작성일: {frontmatter.date}</time>
        {frontmatter.updatedAt && (
          <time>수정일: {frontmatter.updatedAt}</time>
        )}
      </div>
      {frontmatter.tags && Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0 && (
        <div className={css({ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2 })}>
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className={css({ px: 3, py: 1, bg: { base: 'blue.100', _dark: 'blue.900' }, color: { base: 'blue.800', _dark: 'blue.200' }, fontSize: 'sm', rounded: 'full' })}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  )
} 