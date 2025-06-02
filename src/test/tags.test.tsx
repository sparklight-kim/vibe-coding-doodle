import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { routeTree } from '../app/routeTree.gen'

// Mock data for testing
const mockPosts = [
  {
    slug: 'test-post',
    title: 'TanStack Router와 MDX 통합 테스트',
    tags: ['TanStack Router', 'MDX', 'React', 'TypeScript'],
    date: '2024-01-15',
  },
  {
    slug: 'another-post',
    title: '다양한 MDX 기능 테스트',
    tags: ['MDX', 'Markdown', 'Components'],
    date: '2024-01-10',
  },
]

describe('Tags Page', () => {
  let router: any

  beforeEach(() => {
    const memoryHistory = createMemoryHistory({
      initialEntries: ['/tags'],
    })

    router = createRouter({
      routeTree,
      history: memoryHistory,
    })
  })

  it('should render tags page title', async () => {
    render(<RouterProvider router={router} />)
    
    expect(screen.getByText('태그')).toBeInTheDocument()
  })

  it('should display all unique tags from posts', async () => {
    render(<RouterProvider router={router} />)
    
    // 모든 고유 태그가 표시되는지 확인
    expect(screen.getByText('TanStack Router')).toBeInTheDocument()
    expect(screen.getByText('MDX')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Markdown')).toBeInTheDocument()
    expect(screen.getByText('Components')).toBeInTheDocument()
  })

  it('should show post count for each tag', async () => {
    render(<RouterProvider router={router} />)
    
    // MDX 태그는 2개의 포스트에서 사용됨
    const mdxTag = screen.getByText('MDX')
    expect(mdxTag.closest('[data-testid="tag-item"]')).toHaveTextContent('2')
  })

  it('should navigate to tag detail page when tag is clicked', async () => {
    render(<RouterProvider router={router} />)
    
    const mdxTagLink = screen.getByRole('link', { name: /MDX/ })
    expect(mdxTagLink).toHaveAttribute('href', '/tags/MDX')
  })

  it('should display tags in alphabetical order', async () => {
    render(<RouterProvider router={router} />)
    
    const tagElements = screen.getAllByTestId('tag-item')
    const tagNames = tagElements.map(el => el.textContent?.split('(')[0].trim())
    
    // 알파벳 순서로 정렬되어 있는지 확인
    const sortedTagNames = [...tagNames].sort()
    expect(tagNames).toEqual(sortedTagNames)
  })

  it('should have proper SEO meta tags', async () => {
    render(<RouterProvider router={router} />)
    
    // 페이지 제목이 설정되어 있는지 확인
    expect(document.title).toContain('태그')
  })
})

describe('Tag Detail Page', () => {
  let router: any

  beforeEach(() => {
    const memoryHistory = createMemoryHistory({
      initialEntries: ['/tags/MDX'],
    })

    router = createRouter({
      routeTree,
      history: memoryHistory,
    })
  })

  it('should render tag detail page with tag name', async () => {
    render(<RouterProvider router={router} />)
    
    expect(screen.getByText('MDX 태그')).toBeInTheDocument()
  })

  it('should display posts with the selected tag', async () => {
    render(<RouterProvider router={router} />)
    
    // MDX 태그를 가진 포스트들이 표시되는지 확인
    expect(screen.getByText('TanStack Router와 MDX 통합 테스트')).toBeInTheDocument()
    expect(screen.getByText('다양한 MDX 기능 테스트')).toBeInTheDocument()
  })

  it('should show post count for the tag', async () => {
    render(<RouterProvider router={router} />)
    
    expect(screen.getByText('2개의 포스트')).toBeInTheDocument()
  })

  it('should have links to individual posts', async () => {
    render(<RouterProvider router={router} />)
    
    const postLink = screen.getByRole('link', { name: /TanStack Router와 MDX 통합 테스트/ })
    expect(postLink).toHaveAttribute('href', '/posts/test-post')
  })
}) 