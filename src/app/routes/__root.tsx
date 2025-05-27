import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <nav className="bg-gray-100 p-4 mb-8">
        <div className="container mx-auto flex gap-4">
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-800 font-medium"
            activeProps={{ className: 'text-blue-800 font-bold' }}
          >
            홈
          </Link>
          <Link 
            to="/posts" 
            className="text-blue-600 hover:text-blue-800 font-medium"
            activeProps={{ className: 'text-blue-800 font-bold' }}
          >
            포스트
          </Link>
        </div>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})