import type { TocItem } from '../../../shared/utils/mdx'
import { css } from "styled-system/css"

interface PostTocProps {
  toc: TocItem[]
}

export function PostToc({ toc }: PostTocProps) {
  if (!toc.length) return null
  return (
    <nav
      className={css({
        display: { base: 'none', md: 'block' },
        position: 'fixed',
        top: '8rem', // 32
        right: '2rem',
        w: '16rem', // 64
        maxH: '70vh',
        overflowY: 'auto',
        bg: { base: 'whiteAlpha.800', _dark: 'gray.900/80' },
        borderWidth: '1px',
        borderColor: { base: 'gray.200', _dark: 'gray.700' },
        rounded: 'lg',
        shadow: 'lg',
        p: 4,
        zIndex: 20,
      })}
    >
      <h2
        className={css({ fontSize: 'lg', fontWeight: 'bold', mb: 3, color: { base: 'gray.700', _dark: 'gray.200' } })}
      >
        목차
      </h2>
      <ul className={css({ '& > li + li': { mt: 2 } })}>
        {toc.map(item => (
          <li key={item.id} className={css({ ml: item.depth === 2 ? 0 : item.depth === 3 ? 4 : 8 })}>
            <a
              href={`#${item.id}`}
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: 'sm',
                color: { base: 'gray.600', _dark: 'gray.300' },
                _hover: { color: { base: 'blue.600', _dark: 'blue.400' } },
              })}
            >
              <span className={css({ fontFamily: 'mono', userSelect: 'none' })}>
                {item.depth === 2 ? '#' : item.depth === 3 ? '##' : '###'}
              </span>
              <span>{item.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
} 