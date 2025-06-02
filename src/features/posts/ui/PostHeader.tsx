import type { PostFrontmatter } from '../../../entities/post/types'
import { styled, css } from "styled-system/jsx"

interface PostHeaderProps {
  frontmatter: PostFrontmatter
}

const HeaderRoot = styled('header', {
  base: { mb: 8, pb: 8, borderBottomWidth: '1px' },
})

const Title = styled('h1', { base: { fontSize: '4xl', fontWeight: 'bold', mb: 4 } })

const Description = styled('p', { base: { fontSize: 'xl', mb: 4, color: { base: 'gray.600', _dark: 'gray.300' } } })

const Meta = styled('div', { base: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 'sm', color: { base: 'gray.500', _dark: 'gray.400' }, mb: 2 } })

const TagList = styled('div', { base: { mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2 } })

const Tag = styled('span', { base: { px: 3, py: 1, fontSize: 'sm', rounded: 'full', bg: { base: 'blue.100', _dark: 'blue.900' }, color: { base: 'blue.800', _dark: 'blue.200' } } })

export function PostHeader({ frontmatter }: PostHeaderProps) {
  return (
    <HeaderRoot>
      <Title>{frontmatter.title}</Title>
      {frontmatter.description && (
        <Description>{frontmatter.description}</Description>
      )}
      <Meta>
        <time>작성일: {frontmatter.date}</time>
        {frontmatter.updatedAt && (
          <time>수정일: {frontmatter.updatedAt}</time>
        )}
      </Meta>
      {frontmatter.tags && Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0 && (
        <TagList>
          {frontmatter.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagList>
      )}
    </HeaderRoot>
  )
} 