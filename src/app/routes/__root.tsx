import { createRootRoute, HeadContent, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { DarkModeToggle } from '@/shared/components/ui/DarkModeToggle'
import { styled } from "styled-system/jsx"

const NavBar = styled('nav', {
  base: {
    position: 'sticky',
    top: 0,
    zIndex: 30,
    bg: { base: 'whiteAlpha.900', _dark: 'gray.900/90' },
    backdropFilter: 'blur(8px)',
    borderBottomWidth: '1px',
    borderColor: { base: 'gray.200', _dark: 'gray.800' },
  },
})

const NavInner = styled('div', {
  base: {
    maxW: '1280px',
    mx: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    px: { base: 4, md: 8 },
    py: 3,
  },
})

const NavLinks = styled('div', { base: { display: 'flex', gap: 4 } })

const StyledLink = styled(Link, {
  base: {
    color: 'blue.600',
    fontWeight: 'medium',
    _hover: { color: 'blue.800' },
    _activeLink: { color: 'blue.800', fontWeight: 'bold' },
  },
})

const NavRight = styled('div', { base: { display: 'flex', alignItems: 'center', gap: 2 } })

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
      <NavBar>
        <NavInner>
          <NavLinks>
            <StyledLink
              to="/"
            >
              홈
            </StyledLink>
            <StyledLink
              to="/posts"
            >
              포스트
            </StyledLink>
            <StyledLink
              to="/tags"
            >
              태그
            </StyledLink>
          </NavLinks>
          <NavRight>
            <DarkModeToggle />
          </NavRight>
        </NavInner>
      </NavBar>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})