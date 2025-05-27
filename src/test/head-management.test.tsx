import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

// Mock components for testing
const RootComponent = () => (
  <html>
    <head>
      <meta charSet="utf-8" />
    </head>
    <body>
      <div id="root">
        <div>Root Layout</div>
      </div>
    </body>
  </html>
)

const HomeComponent = () => <div>Home Page</div>
const PostsComponent = () => <div>Posts Page</div>
const PostDetailComponent = () => <div>Post Detail Page</div>

describe('Head Management', () => {
  let originalTitle: string
  let originalMeta: NodeListOf<HTMLMetaElement>

  beforeEach(() => {
    // 기존 title과 meta 태그들을 저장
    originalTitle = document.title
    originalMeta = document.querySelectorAll('meta')
  })

  afterEach(() => {
    // 테스트 후 원래 상태로 복원
    document.title = originalTitle
    // 기존 meta 태그들 제거
    document.querySelectorAll('meta').forEach(meta => meta.remove())
    // 원래 meta 태그들 복원
    originalMeta.forEach(meta => document.head.appendChild(meta.cloneNode(true)))
  })

  it('should set default title and meta tags in root route', () => {
    const rootRoute = createRootRoute({
      component: RootComponent,
      head: () => ({
        title: 'My Blog',
        meta: [
          {
            name: 'description',
            content: 'A personal blog about technology',
          },
          {
            name: 'keywords',
            content: 'blog, technology, programming',
          },
        ],
      }),
    })

    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: HomeComponent,
    })

    const routeTree = rootRoute.addChildren([indexRoute])
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ['/'] }),
    })

    render(<RouterProvider router={router} />)

    expect(document.title).toBe('My Blog')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'A personal blog about technology'
    )
    expect(document.querySelector('meta[name="keywords"]')?.getAttribute('content')).toBe(
      'blog, technology, programming'
    )
  })

  it('should override title in nested routes', () => {
    const rootRoute = createRootRoute({
      component: RootComponent,
      head: () => ({
        title: 'My Blog',
        meta: [
          {
            name: 'description',
            content: 'A personal blog about technology',
          },
        ],
      }),
    })

    const postsRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/posts',
      component: PostsComponent,
      head: () => ({
        title: 'Posts - My Blog',
        meta: [
          {
            name: 'description',
            content: 'All blog posts about technology and programming',
          },
        ],
      }),
    })

    const routeTree = rootRoute.addChildren([postsRoute])
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ['/posts'] }),
    })

    render(<RouterProvider router={router} />)

    expect(document.title).toBe('Posts - My Blog')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'All blog posts about technology and programming'
    )
  })

  it('should handle dynamic title and meta tags', () => {
    const rootRoute = createRootRoute({
      component: RootComponent,
      head: () => ({
        title: 'My Blog',
      }),
    })

    const postDetailRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/posts/$postId',
      component: PostDetailComponent,
      head: ({ params }) => ({
        title: `Post ${params.postId} - My Blog`,
        meta: [
          {
            name: 'description',
            content: `Detailed view of post ${params.postId}`,
          },
          {
            property: 'og:title',
            content: `Post ${params.postId} - My Blog`,
          },
          {
            property: 'og:type',
            content: 'article',
          },
        ],
      }),
    })

    const routeTree = rootRoute.addChildren([postDetailRoute])
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ['/posts/123'] }),
    })

    render(<RouterProvider router={router} />)

    expect(document.title).toBe('Post 123 - My Blog')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Detailed view of post 123'
    )
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'Post 123 - My Blog'
    )
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
      'article'
    )
  })

  it('should handle link tags for canonical URLs and favicons', () => {
    const rootRoute = createRootRoute({
      component: RootComponent,
      head: () => ({
        title: 'My Blog',
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
    })

    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: HomeComponent,
    })

    const routeTree = rootRoute.addChildren([indexRoute])
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ['/'] }),
    })

    render(<RouterProvider router={router} />)

    expect(document.querySelector('link[rel="icon"]')?.getAttribute('href')).toBe('/favicon.ico')
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://myblog.com')
  })

  it('should handle script tags', () => {
    const rootRoute = createRootRoute({
      component: RootComponent,
      head: () => ({
        title: 'My Blog',
        scripts: [
          {
            src: 'https://www.google-analytics.com/analytics.js',
            async: true,
          },
          {
            children: 'console.log("Inline script executed");',
          },
        ],
      }),
    })

    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: HomeComponent,
    })

    const routeTree = rootRoute.addChildren([indexRoute])
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ['/'] }),
    })

    render(<RouterProvider router={router} />)

    const externalScript = document.querySelector('script[src="https://www.google-analytics.com/analytics.js"]')
    expect(externalScript).toBeTruthy()
    expect(externalScript?.getAttribute('async')).toBe('')

    const inlineScript = Array.from(document.querySelectorAll('script')).find(
      script => script.textContent?.includes('console.log("Inline script executed");')
    )
    expect(inlineScript).toBeTruthy()
  })
}) 