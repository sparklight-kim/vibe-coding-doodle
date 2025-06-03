import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/posts/$postId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return { post: params.postId };
  },
});

function RouteComponent() {
  const { post } = Route.useLoaderData();
  return <div>Hello &quot;/posts/{post}&quot;!</div>;
}
