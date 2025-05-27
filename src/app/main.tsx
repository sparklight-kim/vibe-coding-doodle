import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { routeTree } from '../shared/utils/router/routeTree.gen'
import './index.css'

// Buffer polyfill for browser environment
import { Buffer } from 'buffer'
if (typeof window !== 'undefined') {
  window.Buffer = Buffer
}

const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
