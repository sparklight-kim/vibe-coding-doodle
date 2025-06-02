import { Link } from '@tanstack/react-router'
import type { TagInfo } from '../../../entities/post/types'
import { css } from "styled-system/css"

interface TagListProps {
  tags: TagInfo[]
}

export function TagList({ tags }: TagListProps) {
  return (
    <div className={css({ maxW: '1280px', mx: 'auto', px: 4, py: 8 })}>
      <h1 className={css({ fontSize: '3xl', fontWeight: 'bold', mb: 8 })}>태그</h1>
      
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 4,
        })}
      >
        {tags.map((tag) => (
          <Link
            key={tag.name}
            to="/tags/$tagName"
            params={{ tagName: tag.name }}
            className={css({
              display: 'block',
              p: 4,
              bg: 'white',
              rounded: 'lg',
              shadow: 'md',
              borderWidth: '1px',
              borderColor: 'gray.200',
              transitionProperty: 'shadow',
              _hover: { shadow: 'lg' },
            })}
            data-testid="tag-item"
          >
            <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}>
              <h3 className={css({ fontSize: 'lg', fontWeight: 'semibold', color: 'gray.800' })}>
                {tag.name}
              </h3>
              <span
                className={css({
                  bg: 'blue.100',
                  color: 'blue.800',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  px: 2.5,
                  py: 0.5,
                  rounded: 'md',
                })}
              >
                {tag.count}
              </span>
            </div>
            <p className={css({ color: 'gray.600', fontSize: 'sm', mt: 2 })}>
              {tag.count}개의 포스트
            </p>
          </Link>
        ))}
      </div>
      
      {tags.length === 0 && (
        <div className={css({ textAlign: 'center', py: 12 })}>
          <p className={css({ color: 'gray.500', fontSize: 'lg' })}>아직 태그가 없습니다.</p>
        </div>
      )}
    </div>
  )
} 