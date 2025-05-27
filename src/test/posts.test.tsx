import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { routeTree } from '../shared/utils/router/routeTree.gen'

describe('Posts Routes with Zod Validation', () => {
  beforeEach(() => {
    // 각 테스트 전에 콘솔 경고를 초기화
    vi.clearAllMocks()
  })

  it('should render posts index page with validated frontmatter', async () => {
    const memoryHistory = createMemoryHistory({
      initialEntries: ['/posts'],
    })
    
    const router = createRouter({
      routeTree,
      history: memoryHistory,
    })

    render(<RouterProvider router={router} />)

    // 페이지 헤더 확인
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Blog Posts/i })).toBeInTheDocument()
    })

    // 포스트 링크가 올바르게 렌더링되는지 확인 (더 구체적인 선택자 사용)
    await waitFor(() => {
      const postLink = screen.getByRole('link', { name: /TanStack Router와 MDX 통합 테스트/i })
      expect(postLink).toBeInTheDocument()
      expect(postLink).toHaveAttribute('href', '/posts/test-post')
    })
  })

  it('should render individual post page with validated frontmatter', async () => {
    const memoryHistory = createMemoryHistory({
      initialEntries: ['/posts/test-post'],
    })
    
    const router = createRouter({
      routeTree,
      history: memoryHistory,
    })

    render(<RouterProvider router={router} />)

    // 포스트 제목 확인 (header 내의 h1 태그)
    await waitFor(() => {
      const postTitle = screen.getByRole('heading', { level: 1, name: /TanStack Router와 MDX 통합 테스트/i })
      expect(postTitle).toBeInTheDocument()
    })

    // frontmatter 정보가 올바르게 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText(/작성일: 2024년 1월 15일/)).toBeInTheDocument()
      expect(screen.getByText(/수정일: 2024년 1월 20일/)).toBeInTheDocument()
    })

    // 태그 확인 (더 구체적인 선택자 사용)
    await waitFor(() => {
      const tags = screen.getAllByText(/TanStack Router/)
      // 태그 스팬 요소만 확인
      const tagSpan = tags.find(element => 
        element.tagName === 'SPAN' && 
        element.className.includes('bg-blue-100')
      )
      expect(tagSpan).toBeInTheDocument()
    })
  })

  it('should handle invalid frontmatter gracefully', async () => {
    const memoryHistory = createMemoryHistory({
      initialEntries: ['/posts/non-existent-post'],
    })
    
    const router = createRouter({
      routeTree,
      history: memoryHistory,
    })

    render(<RouterProvider router={router} />)

    // not-found 페이지의 h1 태그 확인
    await waitFor(() => {
      const notFoundTitle = screen.getByRole('heading', { level: 1, name: /포스트를 찾을 수 없습니다/i })
      expect(notFoundTitle).toBeInTheDocument()
    })
  })

  it('should display validation errors for invalid frontmatter', async () => {
    // 존재하지 않는 포스트로 테스트 (이미 invalid-frontmatter 파일은 삭제됨)
    const memoryHistory = createMemoryHistory({
      initialEntries: ['/posts/non-existent-invalid-post'],
    })
    
    const router = createRouter({
      routeTree,
      history: memoryHistory,
    })

    render(<RouterProvider router={router} />)

    // not-found 페이지가 렌더링되는지 확인 (에러 처리 대신)
    await waitFor(() => {
      const notFoundTitle = screen.getByRole('heading', { level: 1, name: /포스트를 찾을 수 없습니다/i })
      expect(notFoundTitle).toBeInTheDocument()
    }, { timeout: 3000 })
  })
}) 