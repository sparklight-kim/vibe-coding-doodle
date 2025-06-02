import { createRootRoute, HeadContent, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { DarkModeToggle } from '@/shared/components/ui/DarkModeToggle'
import { css } from "styled-system/css"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        title: 'My Blog',
      },
      {
        name: 'description',
        content: 'A personal blog about technology, programming, and development',
      },
      {
        name: 'keywords',
        content: 'blog, technology, programming, development, react, typescript',
      },
      {
        name: 'author',
        content: 'Blog Author',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: 'My Blog',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'canonical',
        href: 'https://myblog.com',
      },
    ],
  }),
  component: () => (
    <>
      <HeadContent />
      <nav
        className={css({
          position: 'sticky',
          top: 0,
          zIndex: 30,
          bg: { base: 'whiteAlpha.900', _dark: 'gray.900/90' },
          backdropFilter: 'blur(8px)',
          borderBottomWidth: '1px',
          borderColor: { base: 'gray.200', _dark: 'gray.800' },
        })}
      >
        <div
          className={css({
            maxW: '1280px',
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
            px: { base: 4, md: 8 },
            py: 3,
          })}
        >
          <div className={css({ display: 'flex', gap: 4 })}>
            <Link
              to="/"
              className={css({ color: 'blue.600', fontWeight: 'medium', _hover: { color: 'blue.800' } })}
              activeProps={{ className: css({ color: 'blue.800', fontWeight: 'bold' }) }}
            >
              홈
            </Link>
            <Link
              to="/posts"
              className={css({ color: 'blue.600', fontWeight: 'medium', _hover: { color: 'blue.800' } })}
              activeProps={{ className: css({ color: 'blue.800', fontWeight: 'bold' }) }}
            >
              포스트
            </Link>
            <Link
              to="/tags"
              className={css({ color: 'blue.600', fontWeight: 'medium', _hover: { color: 'blue.800' } })}
              activeProps={{ className: css({ color: 'blue.800', fontWeight: 'bold' }) }}
            >
              태그
            </Link>
          </div>
          <div className={css({ display: 'flex', alignItems: 'center', gap: 2 })}>
            <DarkModeToggle />
          </div>
        </div>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})