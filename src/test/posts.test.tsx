import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { routeTree } from '../shared/utils/router/routeTree.gen'

describe('Posts Routes', () => {
  it('should render posts index page', async () => {
    const memoryHistory = createMemoryHistory({
      initialEntries: ['/posts'],
    })
    
    const router = createRouter({
      routeTree,
      history: memoryHistory,
    })

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText(/Blog Posts/i)).toBeInTheDocument()
    })
  })

  it('should render individual post page', async () => {
    const memoryHistory = createMemoryHistory({
      initialEntries: ['/posts/test-post'],
    })
    
    const router = createRouter({
      routeTree,
      history: memoryHistory,
    })

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText(/Test Post/i)).toBeInTheDocument()
    })
  })
}) 