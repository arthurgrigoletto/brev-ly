import { env } from '@/env';
import { Route } from '@/routes/$linkId';
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type GetLinkRequest = {
  linkId: string;
};

type GetLinkResponse = {
  originalUrl: string;
};

async function fetchLink({
  signal,
  linkId,
}: GetLinkRequest & { signal: AbortSignal }) {
  const response = await fetch(`${env.VITE_BACKEND_URL}/links/${linkId}`, {
    method: 'GET',
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch links');
  }

  const data: GetLinkResponse = await response.json();
  return data;
}

export function getLinkQueryOptions(linkId: string) {
  return queryOptions({
    queryKey: ['links', { linkId }],
    queryFn: ({ signal }) => fetchLink({ linkId, signal }),
  });
}

export function useLinkDetail() {
  const linkId = Route.useParams().linkId;
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery(getLinkQueryOptions(linkId));
  }, [linkId, queryClient]);

  return useQuery({
    ...getLinkQueryOptions(linkId),
    placeholderData: (previousData) => previousData,
  });
}
