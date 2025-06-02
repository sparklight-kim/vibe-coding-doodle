import { Link } from '@tanstack/react-router'
import type { Post } from '../../../entities/post/types'
import { css } from "styled-system/css"

interface TagDetailProps {
  tagName: string
  posts: Post[]
}

export function TagDetail({ tagName, posts }: TagDetailProps) {
  return (
    <div className={css({ maxW: '1280px', mx: 'auto', px: 4, py: 8 })}>
      <div className="mb-8">
        <Link 
          to="/tags" 
          className={css({ color: 'blue.600', _hover: { color: 'blue.800' }, mb: 4, display: 'inline-block' })}
        >
          ← 모든 태그 보기
        </Link>
        <h1 className={css({ fontSize: '3xl', fontWeight: 'bold', mb: 2 })}>{tagName} 태그</h1>
        <p className={css({ color: 'gray.600' })}>{posts.length}개의 포스트</p>
      </div>
      
      <div className={css({ '& > * + *': { mt: 6 } })}>
        {posts.map((post) => (
          <article 
            key={post.slug}
            className={css({ bg: 'white', rounded: 'lg', shadow: 'md', p: 6, borderWidth: '1px', borderColor: 'gray.200' })}
          >
            <Link 
              to="/posts/$postId"
              params={{ postId: post.slug }}
              className={css({ display: 'block', transitionProperty: 'background-color', _hover: { bg: 'gray.50' } })}
            >
              <h2 className={css({ fontSize: 'xl', fontWeight: 'semibold', color: 'gray.800', mb: 2, _hover: { color: 'blue.600' } })}>
                {post.frontmatter.title}
              </h2>
              <p className={css({ color: 'gray.600', mb: 4 })}>
                {post.frontmatter.description}
              </p>
              <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
                <time className={css({ fontSize: 'sm', color: 'gray.500' })}>
                  {new Date(post.frontmatter.date).toLocaleDateString('ko-KR')}
                </time>
                <div className={css({ display: 'flex', flexWrap: 'wrap', gap: 2 })}>
                  {post.frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className={css({
                        px: 2,
                        py: 1,
                        fontSize: 'xs',
                        rounded: 'full',
                        bg: tag === tagName ? 'blue.100' : 'gray.100',
                        color: tag === tagName ? 'blue.800' : 'gray.600',
                        fontWeight: tag === tagName ? 'medium' : 'normal',
                      })}
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
        <div className={css({ textAlign: 'center', py: 12 })}>
          <p className={css({ color: 'gray.500', fontSize: 'lg' })}>
            '{tagName}' 태그를 가진 포스트가 없습니다.
          </p>
        </div>
      )}
    </div>
  )
} 