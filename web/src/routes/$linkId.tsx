import { NotFound } from '@/components/not-found';
import { Redirect } from '@/components/redirect';
import { getLinkQueryOptions } from '@/http/get-link';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/$linkId')({
  errorComponent: () => <NotFound />,
  loader: ({ context: { queryClient }, params: { linkId } }) => {
    return queryClient.ensureQueryData(getLinkQueryOptions(linkId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const link = Route.useLoaderData();

  useEffect(() => {
    if (link.originalUrl) {
      window.location.href = link.originalUrl;
    }
  }, [link.originalUrl]);

  if (!link.originalUrl) {
    return redirect({ to: '/not-found' });
  }

  return <Redirect redirectTo={link?.originalUrl} />;
}
