import Header from '@/features/layout/ui/Header';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header />
      <div>Hello &quot;/&quot;!</div>
    </>
  );
}
