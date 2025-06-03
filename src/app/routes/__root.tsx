import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      { name: 'description', content: 'blog' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'blog' },
    ],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
