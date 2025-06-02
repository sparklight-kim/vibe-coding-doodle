import { Link } from '@tanstack/react-router'
import type { Post } from '../../../entities/post/types'
import { css } from "styled-system/css"

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <div className={css({ color: { base: 'gray.500', _dark: 'gray.400' }, textAlign: 'center', py: 12 })}>포스트가 없습니다.</div>
  }
  return (
    <div className={css({ '& > * + *': { mt: 6 } })}>
      {posts.map((post) => (
        <article key={post.slug} className={css({ rounded: 'lg', shadow: 'md', p: 6, borderWidth: '1px', borderColor: { base: 'gray.200', _dark: 'gray.700' }, bg: { base: 'white', _dark: 'gray.900' } })}>
          <Link to="/posts/$slug" params={{ slug: post.slug }} className={css({ display: 'block', transitionProperty: 'background-color', _hover: { bg: { base: 'gray.50', _dark: 'gray.800' } } })}>
            <h2 className={css({ fontSize: 'xl', fontWeight: 'semibold', color: { base: 'gray.800', _dark: 'gray.100' }, mb: 2, _hover: { color: { base: 'blue.600', _dark: 'blue.400' } } })}>{post.frontmatter.title}</h2>
            <p className={css({ color: { base: 'gray.600', _dark: 'gray.300' }, mb: 4 })}>{post.frontmatter.description}</p>
            <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
              <time className={css({ fontSize: 'sm', color: { base: 'gray.500', _dark: 'gray.400' } })}>{new Date(post.frontmatter.date).toLocaleDateString('ko-KR')}</time>
              <div className={css({ display: 'flex', flexWrap: 'wrap', gap: 2 })}>
                {post.frontmatter.tags.map((tag) => (
                  <span key={tag} className={css({ px: 2, py: 1, fontSize: 'xs', rounded: 'full', bg: { base: 'gray.100', _dark: 'gray.800' }, color: { base: 'gray.600', _dark: 'gray.300' } })}>{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
} 